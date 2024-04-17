const router = require("express").Router();
const messageRoutes = require("./Message.route");
const userRoutes = require("./Users.route");
const authRoutes = require("./Auth.route");
const validateAccessToken = require("../../middleware/jwt_validation");

router.use("/auth", authRoutes);
router.use("/message", validateAccessToken, messageRoutes);
router.use("/user", validateAccessToken, userRoutes);

module.exports = router;
