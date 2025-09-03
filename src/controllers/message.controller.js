const { errorResponse, successResponse } = require("../utils/responseHandler")

const fetchMessages = async (req, res) => {
    successResponse(res, "MESSAGES FETCHED");
}

const sendMessage = async (req, res) => {
    successResponse(res, "MESSAGE SEND");
}

const deleteMessage = async (req, res) => {
    successResponse(res, "MESSAGE DELETED");
}

module.exports = {
    fetchMessages,
    sendMessage,
    deleteMessage
};