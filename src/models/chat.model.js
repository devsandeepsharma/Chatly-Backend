const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
    {
        chatName: {
            type: String,
            trim: true
        },
        chatDescription: {
            type: String,
            default: "Welcome to this group chat on Chatly!",
            trim: true
        },
        isGroupChat: {
            type: Boolean,
            default: false
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        groupAdmin: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        chatAvatar: {
            type: String,
            default: ""
        },
        latestMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message"
        }
    },
    {
        timestamps: true
    }
)

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;