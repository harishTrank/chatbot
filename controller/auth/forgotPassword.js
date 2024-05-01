const userModel = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;
const tokenUserModel = require("../../models/Token.model");

const forgotPassword = async (req, res, next) => {
  try {
    const getUser = await userModel.findOne({ email: req.body.email });
    if (getUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newpassword, salt);
      await tokenUserModel.findByIdAndUpdate(
        {
          _userId: ObjectId(req.query.id),
        },
        {
          password: hashedPassword,
        },
        {
          new: true,
        }
      );
    }
    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = forgotPassword;
