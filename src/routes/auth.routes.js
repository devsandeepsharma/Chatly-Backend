const { Router } = require("express");

const { 
    sendOTP, 
    verifyOTP, 
    setProfile, 
    guestLogin 
} = require("../controllers/auth.controller");

const router = Router();

router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/set-profile").post(setProfile);
router.route("/guest-login").post(guestLogin);

module.exports = router;