const createConversationModal = require("../../models/Conversation.model");

const createChatGroup = async (req, res, next) => {
  try {
    const response = await createConversationModal.create(req.body);
    return res.status(200).json({
      message: "Group created successfully.",
      response,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

module.exports = createChatGroup;
