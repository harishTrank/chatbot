const router = require("express").Router();
const messageRoutes = require("./Message.route");
const userRoutes = require("./Users.route");
const authRoutes = require("./Auth.route");
const validateAccessToken = require("../../middleware/jwt_validation");
const uploadImage = require("../../controller/uploadImage");

router.use("/auth", authRoutes);
router.use("/message", validateAccessToken, messageRoutes);
router.use("/user", validateAccessToken, userRoutes);

// upload image
router.post("/upload", validateAccessToken, uploadImage);

module.exports = router;
