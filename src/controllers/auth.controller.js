const Otp = require("../models/otp.model");
const User = require("../models/user.model");

const generateOTP = require("../utils/generateOTP");
const generateToken = require("../utils/generateToken");
const { errorResponse, successResponse } = require("../utils/responseHandler");

const sendOTP = async (req, res) => {
    try {
        const email = req.body?.email;

        if (!email) return errorResponse(res, "Email is required", 400);

        const otp = generateOTP();

        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Send OTP Email

        return successResponse(res, "OTP sent successfully", { email, otp });
    } catch (error) {
        return errorResponse(res, "Failed to send OTP");
    }
}

const verifyOTP = async (req, res) => {
    try {
        const email = req.body?.email;
        const otp = req.body?.otp;

        if (!email) return errorResponse(res, "Email is required", 400);
        if (!otp) return errorResponse(res, "OTP is required", 400);

        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord || otpRecord.otp !== otp) {
            return errorResponse(res, "Invalid or expired OTP", 400);
        }

        await Otp.deleteOne({ email });

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email, username: email });
        }

        const token = generateToken({ id: user._id, email: user.email, username: user.username });

        return successResponse(res, "OTP verified successfully", { user, token });
    } catch (error) {
        return errorResponse(res, "Failed to verify OTP");
    }
}

const setProfile = async (req, res) => {
    try {
        const user = req.user;
        const { username, avatar } = req.body;

        if (user.isGuest) {
            return errorResponse(res, "Guest users cannot update profile", 403);
        }

        if (username) user.username = username;
        if (avatar) user.avatar = avatar;

        await user.save();

        return successResponse(res, "Profile updated successfully", { user });
    } catch (error) {
        return errorResponse(res, "Failed to update profile");
    }
}

const guestLogin = async (req, res) => {
    try {
        let user = await User.findOne({ isGuest: true });

        if (!user) {
            user = await User.create(
                { 
                    email: "guest@gmail.com", 
                    username: "Guest User",
                    isGuest: true
                }
            );
        }

        const token = generateToken({ id: user._id, email: user.email, username: user.username });

        return successResponse(res, "Guest login successful", { user, token });
    } catch (error) {
        return errorResponse(res, "Failed to login as guest");
    }
}

module.exports = {
    sendOTP,
    verifyOTP,
    setProfile,
    guestLogin
};