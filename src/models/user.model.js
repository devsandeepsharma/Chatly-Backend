const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true
        },
        username: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        bio: {
            type: String,
            default: "Hi there! I'm using Chatly",
            trim: true,
        },
        avatar: {
            type: String,
            default: ""
        },
        isGuest: {
            type: Boolean,
            default: false
        },
        isOnline: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

userSchema.index({ username: "text", email: "text" });

const User = mongoose.model("User", userSchema);

module.exports = User;