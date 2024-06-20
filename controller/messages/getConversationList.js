const { ObjectId } = require("mongoose").Types;
const Conversation = require("../../models/Conversation.model");

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
      {
        $lookup: {
          from: "message",
          let: { conversation_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$conversation", "$$conversation_id"] },
                    { $not: { $in: [ObjectId(userId), "$deleted_by"] } },
                  ],
                },
              },
            },
            {
              $match: {
                read_by: {
                  $not: { $elemMatch: { user: ObjectId(userId) } },
                },
              },
            },
            {
              $count: "total_count",
            },
          ],
          as: "unread_count",
        },
      },
      {
        $lookup: {
          from: "message",
          let: { conversation_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$conversation", "$$conversation_id"],
                },
              },
            },
            {
              $sort: { created_at: -1 },
            },
            {
              $limit: 1,
            },
          ],
          as: "latestMessage",
        },
      },
      {
        $unwind: {
          path: "$latestMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "latestMessage.created_at": -1,
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
