const userModal = require("../../models/User.model");

const editUserProfile = async (req, res, next) => {
  try {
    await userModal.findByIdAndUpdate(req.query.id, req.body);
    return res.status(200).json({
      message: "User update successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editUserProfile;
