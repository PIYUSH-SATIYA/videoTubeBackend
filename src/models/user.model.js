// This is the code from er diagram on eraser for reference.

//   id string pk
//   username string
//   email string
//   fullName string
//   avatar string
//   coverImage string
//   watchHistory ObjectId[] videos
//   password string
//   refreshToken string
//   createdAt Date
//   updatedAt Date

import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        // username: String,    we can also define properties like this, but to add more properties at once we define it like complex object.
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true, // Not necessary for everything but it makes it easier to query if this is present.
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // Cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video", // This means the obj id we define above will be reffered to the Video model. the model of this doc is User
            },
        ],
        password: {
            type: String,
            required: [true, "password is required"],
        },
        refereshToken: {
            type: String,
        },
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next) {
    // all hooks require some next middleware function

    if (!this.isModified("password")) return next(); // if the modified thing is not the password, we dont want the hashing to run on password.

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // instead of encrypting the input password again manually to compare with the already encrypted and saved password to match both, we use this bcrypt method, it takes care of it all.
};

userSchema.methods.generateRefreshToken = function () {
    // short lived access token
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
};

userSchema.methods.generateAccessToken = function () {
    // short lived access token
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
};

export const User = mongoose.model("User", userSchema);
