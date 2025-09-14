const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

const { errorResponse, successResponse } = require("../utils/responseHandler")

const fetchMessages = async (req, res) => {
    try {
        const chatId = req.query?.chatId;

        if (!chatId) return errorResponse(res, "chatId is required", 400);

        let messages = await Message.find({ chat: chatId })
            .populate("sender", "username email avatar")
            .sort({ createdAt: 1 })

        return successResponse(res, "Messages fetched successfully", { messages });
    } catch (error) {
        return errorResponse(res, "Failed to fetch messages");
    }
}

const sendMessage = async (req, res) => {
    try {
        const chatId = req.body?.chatId;
        const content = req.body?.content;

        if (!chatId || !content) {
            return errorResponse(res, "chatId and content are required", 400);
        }

        const chat = await Chat.findById(chatId);
        if (!chat) return errorResponse(res, "Chat not found", 404);

        const message = await Message.create({
            sender: req.user._id,
            content,
            chat: chatId,
        });

        chat.latestMessage = message._id;

        await chat.save();

        const fullMessage = await Message.findById(message._id)
            .populate("sender", "username email avatar")
            .populate("chat");

        return successResponse(res, "Message sent successfully", { message: fullMessage });
    } catch (error) {
        return errorResponse(res, "Failed to send message");
    }
}

const deleteMessage = async (req, res) => {
    try {
        const messageId = req.body?.messageId;

        if (!messageId) return errorResponse(res, "messageId is required", 400);

        const message = await Message.findById(messageId);
        if (!message) return errorResponse(res, "Message not found", 404);

        const chat = await Chat.findById(message.chat);
        if (!chat) return errorResponse(res, "Chat not found", 404);

        if (!message.sender.equals(req.user._id) && !chat.groupAdmin.equals(req.user._id)) {
            return errorResponse(res, "You are not authorized to delete this message", 403);
        }

        await Message.findByIdAndDelete(messageId);

        if (chat.latestMessage && chat.latestMessage.equals(message._id)) {
            const latest = await Message.find({ chat: chat._id })
                .sort({ createdAt: -1 })
                .limit(1);
            chat.latestMessage = latest[0]?._id || null;
            await chat.save();
        }

        return successResponse(res, "Message deleted successfully");
    } catch (error) {
        return errorResponse(res, "Failed to delete message");
    }
}

module.exports = {
    fetchMessages,
    sendMessage,
    deleteMessage
};