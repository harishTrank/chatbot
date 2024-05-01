const conversationModal = require("../../models/Conversation.model");

const editGroupConversation = async (req, res, next) => {
  try {
    const response = await conversationModal.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      response,
      message: "Group updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editGroupConversation;
