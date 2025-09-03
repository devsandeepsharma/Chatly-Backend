const { Router } = require("express");

const { 
    fetchChats, 
    accessChat,
    createGroupChat,
    updateGroupDetails,
    addToGroup,
    removeFromGroup,
    leaveGroup
} = require("../controllers/chats.controller");
const verifyToken = require("../middlewares/auth.middleware");

const router = Router();

router.route("/").get(verifyToken, fetchChats);
router.route("/").post(verifyToken, accessChat);

router.route("/group").post(verifyToken, createGroupChat);
router.route("/group/update").patch(verifyToken, updateGroupDetails);
router.route("/group/add").post(verifyToken, addToGroup);
router.route("/group/remove").delete(verifyToken, removeFromGroup);
router.route("/group/leave").delete(verifyToken, leaveGroup);

module.exports = router;