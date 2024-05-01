const router = require("express").Router();
const registerUser = require("../../controller/auth/registerUser");
const loginUser = require("../../controller/auth/loginUser");
const byPassLoginUser = require("../../controller/auth/byPassLoginUser");
const forgotPassword = require("../../controller/auth/forgotPassword");

router.post("/register", registerUser);
router.post("/login/user", loginUser);
router.post("/login/bypass", byPassLoginUser);
router.get("/forgot", forgotPassword);

module.exports = router;
