const successResponse = (res, message, data={}, status=200) => {
    return res.status(status).json({
        statusCode: status,
        success: true,
        message,
        data
    });
}

const errorResponse = (res, message, status=500, data={}) => {
    return res.status(status).json({
        statusCode: status,
        success: false,
        message,
        data
    });
}

module.exports = { successResponse, errorResponse };