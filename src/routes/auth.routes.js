const { Router } = require("express");

const { 
    sendOTP, 
    verifyOTP, 
    setProfile, 
    guestLogin 
} = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/auth.middleware");

const router = Router();

router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/set-profile").post(verifyToken, setProfile);
router.route("/guest-login").post(guestLogin);

module.exports = router;