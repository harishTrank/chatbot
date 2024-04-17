const userModel = require("../../models/User.model");

const getUserbyId = async (req, res, next) => {
  try {
    const response = await userModel.findOne({ _id: req.query.userId });
    return res.status(200).json({
      message: "success",
      response,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

module.exports = getUserbyId;
