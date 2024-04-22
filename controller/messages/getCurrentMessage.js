const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;
const MessageModal = require("../../models/Message.model");

const getCurrentMessage = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  const { query } = req;

  try {
    let matchQuery = {};
    if (query?.conversationId) {
      matchQuery = {
        ...matchQuery,
        conversation: ObjectId(query.conversationId),
      };
    } else if (query?.messageId) {
      matchQuery = {
        ...matchQuery,
        _id: ObjectId(query.messageId),
      };
    } else {
      throw createError.BadRequest(
        "Either conversationId or messageId is required."
      );
    }

    // Add additional match conditions
    matchQuery = {
      ...matchQuery,
      deleted_by: { $ne: userId },
    };

    const messages = await MessageModal.aggregate([
      {
        $match: matchQuery,
      },
      { $sort: { created_at: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "post",
          localField: "postMessage",
          foreignField: "_id",
          as: "postData",
        },
      },
      { $unwind: { path: "$postData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "user",
          localField: "postData.user",
          foreignField: "_id",
          as: "postData.userDetail",
        },
      },
      {
        $unwind: {
          path: "$postData.userDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      {
        $project: {
          _id: 1,
          type: 1,
          message: 1,
          read_by: 1,
          image: 1,
          sender: {
            _id: 1,
            name: 1,
            user_handle: 1,
            avatar_url: 1,
          },
          postData: {
            media: 1,
            _id: 1,
            description: 1,
            created_at: 1,
            userDetail: {
              _id: 1,
              name: 1,
              user_handle: 1,
              email: 1,
              avatar_url: 1,
            },
          },
          created_at: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "success",
      data: messages?.[0],
    });
  } catch (error) {
    console.log("Error fetching recent messages:", error);
    next(error);
  }
};

module.exports = getCurrentMessage;
