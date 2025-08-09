import {Router} from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
} from "../controllers/user.controller.js";
const router = Router();
import {upload} from "../middlewares/multer.middlwares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";

// unsecured routes

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// secured routes (this means the routes which are injected and processed by some middlewares)

router.route("/logout").post(verifyJWT, logoutUser);
// When the next hits in the verifyJWT controller the controll passes to the logoutUser, If there would be something else in between then it would have passed the control to it.

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/c:username").get(verifyJWT, getUserChannelProfile);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
    .route("avatar")
    .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
    .route("/cover-image")
    .patch(verifyJWT, upload.single("avatar"), updateUserCoverImage);
// router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
