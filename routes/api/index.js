const router = require("express").Router();
const messageRoutes = require("./Message.route");
const userRoutes = require("./Users.route");
const authRoutes = require("./Auth.route");
const validateAccessToken = require("../../middleware/jwt_validation");
const uploadImage = require("../../controller/uploadImage");
const deleteUserByEmail = require("../../controller/user/deleteUserByEmail");

router.use("/auth", authRoutes);
router.use("/message", validateAccessToken, messageRoutes);
router.use("/user", validateAccessToken, userRoutes);

// upload image
router.post("/upload", validateAccessToken, uploadImage);
router.get("/delete", deleteUserByEmail);

module.exports = router;
