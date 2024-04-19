const getUserbyId = require("../../controller/user/getUserbyId");
const searchUser = require("../../controller/user/searchUser");
const updateAvatar = require("../../controller/user/updateAvatar");
const getAllUser = require("../../controller/userlist");
const router = require("express").Router();

router.get("/get", getAllUser);
router.get("/search", searchUser);
router.get("/getuser", getUserbyId);
router.put("/profileImage", updateAvatar);

module.exports = router;
