const Chat = require("../models/chat.model");

const { errorResponse, successResponse } = require("../utils/responseHandler");

const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({ users: req.user._id })
            .populate("users", "username email avatar")
            .populate("groupAdmin", "username email avatar")
            .populate("latestMessage")
            .sort({ updatedAt: -1 }); 

        return successResponse(res, "Chats fetched successfully", { chats });
    } catch (error) {
        return errorResponse(res, "Failed to fetch chats");
    }
}

const accessChat = async (req, res) => {
    try {
        const userId = req.body?.userId;

        if (!userId) {
            return errorResponse(res, "UserId is required", 400);
        }

        let chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user._id, userId] },
        }).populate("users", "username email avatar").populate("latestMessage")

        if (chat) {
            return successResponse(res, "Chat fetched successfully", { chat });
        }

        const newChat = await Chat.create({
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        })

        chat = await Chat.findById(newChat._id).populate(
            "users",
            "username email avatar"
        );

        return successResponse(res, "New chat created", { chat });
    } catch (error) {
        return errorResponse(res, "Failed to access chat");
    }
}

const createGroupChat = async (req, res) => {
    try {
        const name = req.body?.name;
        const users = req.body?.users;
        const avatar = req.body?.avatar;

        if (!name || !users || users.length < 2) {
            return errorResponse(res, "More than 2 users are required to create a group", 400);
        }

        const groupUsers = [...users, req.user._id];

        const chat = await Chat.create({
            chatName: name,
            isGroupChat: true,
            users: groupUsers,
            groupAdmin: req.user._id,
            avatar: avatar || "",
        });

        const fullChat = await Chat.findById(chat._id)
            .populate("users", "username email avatar")
            .populate("groupAdmin", "username email avatar");

        return successResponse(res, "Group chat created successfully", { chat: fullChat });
    } catch (error) {
        return errorResponse(res, "Failed to create group chat");
    }
}

const updateGroupDetails = async (req, res) => {
    try {
        const chatId = req.body?.chatId;
        const { name, chatDescription, avatar } = req.body;

        if (!chatId) return errorResponse(res, "chatId is required", 400);

        const chat = await Chat.findById(chatId);
        if (!chat || !chat.isGroupChat) {
            return errorResponse(res, "Group chat not found", 404);
        }

        if (!chat.groupAdmin.equals(req.user._id)) {
            return errorResponse(res, "Only admin can update group details", 403);
        }

        if (name) chat.chatName = name;
        if (avatar) chat.avatar = avatar;
        if (chatDescription) chat.chatDescription = chatDescription;

        await chat.save();

        const updatedChat = await Chat.findById(chatId)
            .populate("users", "username email avatar")
            .populate("groupAdmin", "username email avatar");

        return successResponse(res, "Group details updated successfully", { chat: updatedChat });
    } catch (error) {
        return errorResponse(res, "Failed to update group details");
    }
}

const addToGroup = async (req, res) => {
    try {
        const chatId = req.body?.chatId;
        const users = req.body?.users;

        if (!chatId || !users || users.length === 0) {
            return errorResponse(res, "chatId and users are required", 400);
        }

        const chat = await Chat.findById(chatId);
        if (!chat || !chat.isGroupChat) {
            return errorResponse(res, "Group chat not found", 404);
        }

        if (!chat.groupAdmin.equals(req.user._id)) {
            return errorResponse(res, "Only admin can add users", 403);
        }

        users.forEach((userId) => {
            if (!chat.users.includes(userId)) {
                chat.users.push(userId);
            }
        });

        await chat.save();

        const updatedChat = await Chat.findById(chatId)
            .populate("users", "username email avatar")
            .populate("groupAdmin", "username email avatar");

        return successResponse(res, "Users added to group successfully", { chat: updatedChat });
    } catch (error) {
        return errorResponse(res, "Failed to add users to group");
    }
}

const removeFromGroup = async (req, res) => {
    try {
        const chatId = req.body?.chatId;
        const userId = req.body?.userId;

        if (!chatId || !userId) {
            return errorResponse(res, "chatId and userId are required", 400);
        }

        const chat = await Chat.findById(chatId);
        if (!chat || !chat.isGroupChat) {
            return errorResponse(res, "Group chat not found", 404);
        }

        if (!chat.groupAdmin.equals(req.user._id)) {
            return errorResponse(res, "Only admin can add users", 403);
        }

        chat.users = chat.users.filter(
            (user) => user.toString() !== userId.toString()
        );

        await chat.save();

        const updatedChat = await Chat.findById(chatId)
            .populate("users", "username email avatar")
            .populate("groupAdmin", "username email avatar");

        return successResponse(res, "User removed from group successfully", { chat: updatedChat });
    } catch (error) {
        return errorResponse(res, "Failed to remove user from group");
    }
}

const leaveGroup = async (req, res) => {
    try {
        const chatId = req.body?.chatId;

        if (!chatId) {
            return errorResponse(res, "chatId is required", 400);
        }

        const chat = await Chat.findById(chatId);
        if (!chat || !chat.isGroupChat) {
            return errorResponse(res, "Group chat not found", 404);
        }

        if (chat.groupAdmin.equals(req.user._id)) {
            return errorResponse(res, "Admin cannot leave the group", 403);
        }

        chat.users = chat.users.filter(
            (user) => user.toString() !== req.user._id.toString()
        );

        await chat.save();

        const updatedChat = await Chat.findById(chatId)
            .populate("users", "username email avatar")
            .populate("groupAdmin", "username email avatar");

        return successResponse(res, "You have left the group", { chat: updatedChat });
    } catch (error) {
        return errorResponse(res, "Failed to leave the group");
    }
}

module.exports = {
    fetchChats,
    accessChat,
    createGroupChat,
    updateGroupDetails,
    addToGroup,
    removeFromGroup,
    leaveGroup
};