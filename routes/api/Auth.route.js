const router = require("express").Router();
const registerUser = require("../../controller/auth/registerUser");
const loginUser = require("../../controller/auth/loginUser");

router.post("/register", registerUser);
router.post("/login/user", loginUser);

module.exports = router;
