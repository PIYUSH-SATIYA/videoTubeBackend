// This is pretty standard file and does not change much with different projects.

// This is to safely overwrite the errors thrown by the error module as we have written our own error middleware.

import mongoose from "mongoose"; // This is because some of our errors may be from mongoDB

import {APIError} from "../utils/APIErrors.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof APIError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? 400 : 500;

        const message = error.message || "something went wrong";
        error = new APIError(
            statusCode,
            message,
            error?.errors || [],
            err.stack
        );
    }

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "developement"
            ? {stack: error.stack}
            : {}),
    };

    return res.status(error.statusCode).json(response);
};
