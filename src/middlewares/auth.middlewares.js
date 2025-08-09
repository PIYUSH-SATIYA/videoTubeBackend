import jwt, {decode} from "jsonwebtoken";
import {User} from "../models/user.model.js";
import {APIError} from "../utils/APIErrors.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token =
        req.cookies.accesToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new APIError(401, "Unauthorized");
    }

    try {
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select(
            "-password -refreshToken"
        );

        req.user = user;
        next(); // To pass the controll to the next controller written in sequence in the routes.
        // This is a must to pass the control to the next controller
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid access token");
    }
});
