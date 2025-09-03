const { errorResponse, successResponse } = require("../utils/responseHandler");

const fetchChats = async (req, res) => {
    successResponse(res, "CHATS FETCHED");
}

const accessChat = async (req, res) => {
    successResponse(res, "ACCESS CHATS");
}

const createGroupChat = async (req, res) => {
    successResponse(res, "GROUP CHAT CREATED");
}

const updateGroupDetails = async (req, res) => {
    successResponse(res, "GROUP CHAT UPDATED");
}

const addToGroup = async (req, res) => {
    successResponse(res, "USER ADDED TO GROUP");
}

const removeFromGroup = async (req, res) => {
    successResponse(res, "USER REMOVED FROM GROUP");
}

const leaveGroup = async (req, res) => {
    successResponse(res, "USER LEFT THE GROUP");
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