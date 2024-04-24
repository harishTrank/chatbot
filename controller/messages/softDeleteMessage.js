const messageModal = require("../../models/Message.model");

const softDeleteMessage = async (req, res, next) => {
  try {
    const response = await messageModal.findByIdAndUpdate(req.query.id, {
      deleteMessage: true,
    });
    return res.status(200).json({
      message: "Message deleted successfully.",
      response,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

module.exports = softDeleteMessage;
