// Import necessary modules
const User = require("../../models/User.model");

const searchUser = async (req, res, next) => {
  try {
    const { search } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });
    res.status(200).json({
      response: users,
      message: "User data getting successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = searchUser;
