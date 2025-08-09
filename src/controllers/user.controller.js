import {APIResponse} from "../utils/APIResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {APIError} from "../utils/APIErrors.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import {application, json} from "express";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = User.findById(userId);
        // Small check for user existence

        const refereshToken = generateRefreshToken();
        const accessToken = generateAccessToken();

        user.refereshToken = refereshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refereshToken};
    } catch (error) {
        throw new APIError(
            500,
            "Something went wrong while generating access and refresh tokens"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const {fullname, username, email, password} = req.body;

    // Validation
    // all field are required
    if (
        [fullname, username, email, password].some(
            (fields) => fields?.trim() === ""
        ) // this is just like checking for each field in the array, whether it is empty after trimming, means the field is left empty by the user.
    ) {
        throw new APIError(400, "All fields are required");
    }

    // whether the user already exists or not.
    const existedUser = await User.findOne({
        email, // from the User module from the database we find whether any exists with given parameters, as in the findOne()
        $or: [{username}, {email}], // This is the mongoDB operator (starting with $ sign)
        // The or method takes an array, and returns true if there exists already.
    });

    if (existedUser) {
        throw new APIError(400, "User already exists");
    }

    // File handling

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new APIError(400, "Avatar files is missing");
    }

    // This can be optimized
    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // let coverImage = "";

    // if (coverLocalPath) {
    //     coverImage = await uploadOnCloudinary(coverLocalPath);
    // }

    // Optimization for uploading
    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        console.log("uploaded avatar");
    } catch (error) {
        console.log("Error uploading avatar", error);
        throw new APIError(500, "Failed to upload avatar");
    }

    let coverImage;
    try {
        coverImage = await uploadOnCloudinary(coverLocalPath);
        console.log("uploaded cover Image");
    } catch (error) {
        console.log("Error uploading cover Image", error);
        throw new APIError(500, "Failed to upload cover Image");
    }

    try {
        const user = await User.create({
            // This is database operation so awaited
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),
        });

        // This is just an extra query from database to get the user we just created above, just to confirm that the user is created
        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            throw new APIError(
                500,
                "Something went wrong while registering a user"
            );
        }

        return res
            .status(201)
            .json(new APIResponse(200, "User registered successfully"));
    } catch (error) {
        console.log("user creation failed");

        if (avatar) {
            await deleteFromCloudinary(avatar.public_id);
        }

        if (coverImage) {
            await deleteFromCloudinary(coverImage.public_id);
        }

        throw new APIError(
            500,
            "something went wrong while registering the user and images are now deleted"
        );
    }
});

const loginUser = asyncHandler(async (req, res) => {
    // get data from body
    const {email, username, password} = req.body;

    // validation
    if (!email) {
        throw new APIError(409, "Email is required");
    } // Similarly we can set up check for other fields too

    const user = await User.findOne({
        $or: [{username}, {email}],
    });

    if (!user) {
        throw new APIError(404, "User not found");
    }

    // validate if the password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new APIError(401, "Invalid password");
    }

    const {accessToken, refereshToken} = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!loggedInUser) {
        throw new APIError(404, "can't login");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return (
        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refershToke", refereshToken, options)
            // We may not directly send the cookies from the mobile devices so we may have to include in the body also. it depends.
            .json(
                new APIResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken,
                        refereshToken,
                    },
                    "User logged in successfully"
                )
            )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {new: true}
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return (
        res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            // We clear access and refresh token when the user is to log out
            .json(new APIResponse(200, "User logged out successfully"))
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    incomingRefreshToken = req.cookies.refereshToken || req.body.refereshToken;

    // Now we can see in the user model and we find that here, in this case in the refreshToken we are just storing the user._Id.
    // so we can take advantage of that.

    try {
        jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id);

        if (!user) {
            throw new APIError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refereshToken) {
            throw new APIError(401, "Invalid refresh token");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        const {accessToken, refreshToken: newRefreshToken} =
            await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new APIResponse(
                    200,
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {}
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new APIError(401, "Old password is incorrect");
    }

    user.password = newPassword;

    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new APIResponse(200, {}, "password changed successfully"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new APIResponse(200, req.user, "current user details"));
});
const updateAccountDetails = asyncHandler(async (req, res) => {
    // first we have to decide that what we are allowing the user to modify.
    // Here fullname and email

    const {fullname, email} = req.body;

    if (!fullname || !email) {
        throw new APIError(400, "fullname and email are required");
    }

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email,
            },
        },
        {new: true}
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(
            new APIResponse(200, user, "Account details updated successfully")
        );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new APIError(400, "file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new APIError(500, "Something went wrong while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        {
            new: true,
        }
    ).select("-password -refereshToken");

    return res
        .status(200)
        .json(new APIResponse(200, user, "avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coevrImageLoacalPath = req.file?.path;

    if (!coevrImageLoacalPath) {
        throw new APIError(400, "file is required");
    }

    const coverImage = await uploadOnCloudinary(coevrImageLoacalPath);

    if (!coverImage.url) {
        throw new APIError(
            500,
            "something went wrong while uploading cover image"
        );
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
            },
        },
        {new: true}
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new APIResponse(200, user, "cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const {username} = req.params;

    if (!username) {
        throw new APIError(400, "username is required");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase(),
            },
        },
        {
            $lookup: {
                from: "subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            },
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers",
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo",
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            // project only the necessary data
            $project: {
                fullname: 1,
                username: 1,
                avatar: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                coverImage: 1,
                email: 1,
            },
        },
    ]);

    if (!channel?.length) {
        throw new APIError(404, "channel not found");
    }

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                channel[0],
                "channel profile fetched successfully"
            )
        );
});

const getWatchHistory = asyncHandler(async (req, res) => {
    // we can grab a user also from params as above, but another way is
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id), // mongoose requires special mongoose obj id and not req.user._id, this is the method, sometimes shown deprecated so may be an error.
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",

                // optional pipeline
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                ],
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                user[0]?.watchHistory,
                "watch history fetched successfully"
            )
        );
});

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
};
