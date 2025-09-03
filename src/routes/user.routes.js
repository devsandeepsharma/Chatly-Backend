const { Router } = require("express");

const { 
    getUser,
    updateUser,
    deleteUser,
    searchUser,
    getUserSuggestions
} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/auth.middleware");

const router = Router();

router.route("/").get(verifyToken, getUser);
router.route("/").patch(verifyToken, updateUser);
router.route("/").delete(verifyToken, deleteUser);

router.route("/search").get(verifyToken, searchUser);
router.route("/suggestions").get(verifyToken, getUserSuggestions);

module.exports = router;