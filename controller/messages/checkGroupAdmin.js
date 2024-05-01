const conversationModal = require("../../models/Conversation.model");

const checkGroupAdmin = async (req, res, next) => {
  try {
    const { conversationId, userId } = req.query;
    const conversation = await conversationModal.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    if (conversation.groupAdmin.includes(userId)) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(200).json({ isAdmin: false });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = checkGroupAdmin;
