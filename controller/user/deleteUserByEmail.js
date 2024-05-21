const userModal = require("../../models/User.model");

const deleteUserByEmail = async (req, res, next) => {
  try {
    await userModal.deleteOne({ email: req.query.email });
    return res.status(200).json({
      message: "Delete user successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteUserByEmail;
