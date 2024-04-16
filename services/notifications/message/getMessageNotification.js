const User = require("../../../models/User.model");
const Notification = require("../../../models/Notification.model");
const Conversation = require("../../../models/Conversation.model");
const { ObjectId } = require("mongoose").Types;

/**
 *  Saves new follow notification and emits a socket event
 * @param {String} actor - user that is generating the action
 * @param {String} receiver - user that is receiving the notification
 * @param {Object} io - socket object
 */
const newMessageNotification = async (actor, receiver, conversationId, io) => {
  try {
    const userId = receiver?.[0];
    const sender = await User.findOne(
      { _id: actor },
      { name: 1, _id: 1, user_handle: 1, avatar_url: 1 }
    );
    const conversationList = await Conversation.aggregate([
      {
        $match: {
          _id: ObjectId(conversationId),
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $in: [ObjectId(userId), "$members"] },
              { $not: { $in: [ObjectId(userId), "$hidden_by"] } },
            ],
          },
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
        $unwind: {
          path: "$unread_count",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          created_at: 1,
          updated_at: 1,
          last_message: 1,
          unread_count: "$unread_count.total_count",
          // unread_count: 1,
          // recentMessages: 1,
          // owner: 1,
          members: {
            _id: 1,
            name: 1,
            avatar_url: 1,
            status: 1,
            user_handle: 1,
          },
        },
      },
      { $sort: { updated_at: -1 } },
    ]);

    const message = `You have a new message from ${sender.user_handle}`;
    if (conversationList?.[0]?.unread_count <= 1) {
      const notification = new Notification({
        actor,
        verb: "new-message",
        message,
        subject: sender?.user_handle,
        receiver,
        conversationId,
      });
      console.log("notification", notification);
      await notification.save();
      io.to(receiver.toString()).emit("new-notification", {
        actor,
        verb: "new-message",
        message,
        subject: sender?.user_handle,
        avatar: sender.avatar_url,
        receiver,
        conversationId,
      });
      await User.findOneAndUpdate(
        {
          _id: ObjectId(userId),
        },
        {
          $inc: { notificationCount: 1 },
        },
        {
          new: true,
        }
      );
    }
  } catch (err) {
    console.log("err in new message notification service: ", err);
    return err;
  }
};

module.exports = newMessageNotification;
