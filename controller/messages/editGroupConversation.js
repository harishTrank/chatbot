const conversationModal = require("../../models/Conversation.model");
const { ObjectId } = require("mongoose").Types;

const editGroupConversation = async (req, res, next) => {
  try {
    await conversationModal.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
    });

    const response = await conversationModal.aggregate([
      {
        $match: {
          _id: ObjectId(req.query.id),
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
                    { $not: { $in: [ObjectId(req.query.id), "$deleted_by"] } },
                  ],
                },
              },
            },
            {
              $match: {
                read_by: {
                  $not: { $elemMatch: { user: ObjectId(req.query.id) } },
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

    return res.status(200).json({
      response: response[0],
      message: "Group updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editGroupConversation;
