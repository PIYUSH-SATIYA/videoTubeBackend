import {APIResponse} from "../utils/APIResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new APIResponse(200, "OK", "Health Check Passed"));
});

export {healthCheck};

// We could have written this healthCheck in try catch block, but we have built a standard template asynchandler for this, which standard, handles sync and async, and promisifies everything.

// The logic is written here, which is nothing just sending ok all the time. but the serving or the routing part is in the routes directory.
