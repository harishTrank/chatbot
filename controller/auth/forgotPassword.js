const userModel = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;
const tokenUserModel = require("../../models/Token.model");
const bcrypt = require("bcryptjs");

const forgotPassword = async (req, res, next) => {
  try {
    const { email, newpassword } = req.query;
    if (email && newpassword) {
      const getUser = await userModel.findOne({ email: email });
      if (getUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);
        const updated = await tokenUserModel.findOneAndUpdate(
          {
            _userId: getUser._id,
          },
          {
            password: hashedPassword,
          },
          {
            new: true,
          }
        );
        return res.status(200).json({
          message: "Password updated successfully.",
        });
      }
    }
    return res.status(404).json({
      message: "Please enter email and newpassword.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = forgotPassword;
