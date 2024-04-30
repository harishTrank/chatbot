const userModel = require("../../models/User.model");
const bcrypt = require("bcryptjs");
const tokenUserModel = require("../../models/Token.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");
const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;

const byPassLoginUser = async (req, res, next) => {
  try {
    const { employeeId, name, email, password } = req.body;
    const getUser = await userModel.findOne({ email, employeeId });
    if (getUser) {
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
      const accessToken = generateAccessToken(payload, accessTokenLife);
      const refreshToken = generateRefreshToken(payload, refreshTokenLife);

      return res.status(200).json({
        statusCode: 200,
        message: "User login successfully.",
        getUser,
        accessToken,
        refreshToken,
      });
    } else {
      let userCreate = new userModel({
        email,
        name,
        employeeId,
      });
      await userCreate.save();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let tokenModel = new tokenUserModel({
        _userId: userCreate._id,
        password: hashedPassword,
      });
      await tokenModel.save();
      const isMatch = await bcrypt.compare(password, tokenModel.password);
      if (!isMatch) {
        return res.status(401).json({
          statusCode: 401,
          message: "Unauthorized..",
        });
      }

      const payload = {
        data: {
          user: userCreate,
        },
        type: "user",
      };
      const accessToken = generateAccessToken(payload, accessTokenLife);
      const refreshToken = generateRefreshToken(payload, refreshTokenLife);

      return res.status(200).json({
        statusCode: 200,
        message: "User login successfully.",
        getUser: userCreate,
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

module.exports = byPassLoginUser;
