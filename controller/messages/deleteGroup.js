const conversationModel = require("../../models/Conversation.model");
const messageModal = require("../../models/Message.model");
const { ObjectId } = require("mongoose").Types;

const deleteGroup = async (req, res, next) => {
  try {
    await conversationModel.deleteOne({ _id: ObjectId(req.query.id) });
    await messageModal.deleteMany({ conversation: ObjectId(req.query.id) });
    return res.status(200).json({
      message: "Group deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteGroup;
