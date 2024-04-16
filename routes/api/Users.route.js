const getAllUser = require("../../controller/userlist");
const validateAccessToken = require("../../middleware/jwt_validation");
const router = require("express").Router();

router.get("/get", validateAccessToken, getAllUser);

module.exports = router;
