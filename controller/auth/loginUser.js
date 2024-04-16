const testUser = require("../../models/User.model");
const bcrypt = require("bcryptjs");
const tokenUserModel = require("../../models/Token.model");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");
const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const getUser = await testUser.findOne({ email });
  if (!getUser) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not found.",
    });
  }

  const userCredentials = await tokenUserModel.findOne({
    _userId: getUser._id,
  });
  const isMatch = await bcrypt.compare(password, userCredentials.password);
  if (!isMatch) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized..",
    });
  }

  const payload = {
    data: {
      user: getUser,
    },
    type: "user",
  };
  //Generate new access and refresh tokens
  const accessToken = generateAccessToken(payload, accessTokenLife);
  const refreshToken = generateRefreshToken(payload, refreshTokenLife);

  return res.status(200).json({
    statusCode: 200,
    message: "User find successfully.",
    getUser,
    accessToken,
    refreshToken,
  });
};

module.exports = loginUser;
