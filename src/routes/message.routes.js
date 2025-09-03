const { Router } = require("express");

const { 
    fetchMessages, 
    sendMessage, 
    deleteMessage 
} = require("../controllers/message.controller");
const verifyToken = require("../middlewares/auth.middleware");

const router = Router();

router.route("/").get(verifyToken, fetchMessages);
router.route("/").post(verifyToken, sendMessage);
router.route("/").delete(verifyToken, deleteMessage);

module.exports = router;