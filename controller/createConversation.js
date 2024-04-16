const createError = require("http-errors");
const Conversation = require("../models/Conversation.model");

/**
 * Create a messaging group
 * @param {Array<ObjectId>} users - users _id list
 */
const createConversation = async (req, res, next) => {
  const { usersList } = req.body;
  try {
    if (usersList?.length < 2)
      throw createError.BadRequest(
        "Minimum 2 users are required in a conversation"
      );
    const existingConversation = await Conversation.findOne({
      members: { $all: usersList },
    }).select("-hidden_by");
    if (existingConversation) {
      return res.status(200).json({
        message: "success",
        data: existingConversation,
      });
    }
    const group = Conversation.create({
      members: usersList,
      type: "single",
      hidden_by: usersList,
    });
    const populatedConversation = await Conversation.populate(group, "members");

    return res.status(200).json({
      message: "success",
      data: {
        _id: populatedConversation?._id,
        members: populatedConversation?.members,
        type: populatedConversation?.type,
      },
    });
  } catch (error) {
    console.log("create group error: ", error);
    next(error);
  }
};

module.exports = createConversation;
