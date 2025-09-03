const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const { errorResponse } = require("../utils/responseHandler");

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return errorResponse(res, "Authorization token missing", 401);
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, "Invalid or expired token", 401);
    }
}

module.exports = verifyToken;