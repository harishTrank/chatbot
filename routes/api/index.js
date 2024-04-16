const router = require("express").Router();
const messageRoutes = require("./Message.route");
const userRoutes = require("./Users.route");
const authRoutes = require("./Auth.route");

router.use("/message", messageRoutes);
router.use("/user", userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
