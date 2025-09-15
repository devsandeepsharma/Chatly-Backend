const { Router } = require("express");

const { 
    fetchMessages, 
    sendMessage, 
    deleteMessage,
    markMessagesAsRead,
    fetchUnreadChats
} = require("../controllers/message.controller");
const verifyToken = require("../middlewares/auth.middleware");

const router = Router();

router.route("/").get(verifyToken, fetchMessages);
router.route("/").post(verifyToken, sendMessage);
router.route("/").delete(verifyToken, deleteMessage);
router.route("/read").patch(verifyToken, markMessagesAsRead);
router.route("/unread").get(verifyToken, fetchUnreadChats);

module.exports = router;