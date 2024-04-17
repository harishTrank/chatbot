const { ObjectId } = require("mongoose").Types;
const Conversation = require("../../models/Conversation.model");
const User = require("../../models/User.model");

const getConversationList = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const conversations = await Conversation.aggregate([
      {
        $match: {
          members: ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "members",
          foreignField: "_id",
          as: "membersInfo",
        },
      },
    ]);
    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getConversationList;
