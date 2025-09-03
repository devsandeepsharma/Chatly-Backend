const User = require("../models/user.model");

const { errorResponse, successResponse } = require("../utils/responseHandler");

const getUser = (req, res) => {
    try {
        const user = req.user;
        if (!user) return errorResponse(res, "User not found", 404);

        return successResponse(res, "User fetched successfully", { user });
    } catch (error) {
        return errorResponse(res, "Failed to fetch user");
    }
}

const updateUser = async (req, res) => {
    try {
        const user = req.user;
        const { username, bio, avatar } = req.body;

        if (user.isGuest) {
            return errorResponse(res, "Guest users cannot update profile", 403);
        }

        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (avatar) user.avatar = avatar;

        await user.save();

        return successResponse(res, "Profile updated successfully", { user });
    } catch (error) {
        return errorResponse(res, "Failed to update profile");
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = req.user;

        if (user.isGuest) {
            return errorResponse(res, "Guest users cannot delete profile", 403);
        }

        await User.findByIdAndDelete(user._id);

        return successResponse(res, "User deleted successfully");
    } catch (error) {
        return errorResponse(res, "Failed to delete user");
    }
}

const searchUser = async (req, res) => {
    try {
        const keyword = req.query.q
            ? {
                _id: { $ne: req.user._id },
                $or: [
                { username: { $regex: req.query.q, $options: "i" } },
                { email: { $regex: req.query.q, $options: "i" } },
                ],
            }
            : {};

        const users = await User.find(keyword);

        return successResponse(res, "Users found", { users });
    } catch (error) {
        return errorResponse(res, "Failed to search users");
    }
}

const getUserSuggestions = async (req, res) => {
    try {
        const users = await User.aggregate([
            { $match: { _id: { $ne: req.user._id } } },
            { $sample: { size: 4 } }
        ])

        return successResponse(res, "User suggestions fetched", { users });
    } catch (error) {
        return errorResponse(res, "Failed to fetch user suggestions");
    }
}

module.exports = {
    getUser,
    updateUser,
    deleteUser,
    searchUser,
    getUserSuggestions
};