const { errorResponse, successResponse } = require("../utils/responseHandler");

const getUser = (req, res) => {
    successResponse(res, "GET USER");
}

const updateUser = async (req, res) => {
    successResponse(res, "UPDATE USER");
}

const deleteUser = async (req, res) => {
    successResponse(res, "DELETE USER");
}

const searchUser = async (req, res) => {
    successResponse(res, "SEARCH USER");
}

const getUserSuggestions = async (req, res) => {
    successResponse(res, "GET SUGGESTIONS");
}

module.exports = {
    getUser,
    updateUser,
    deleteUser,
    searchUser,
    getUserSuggestions
};