const Notification = require("../../models/Notification.model");
const Admin = require("../../models/Admin");
const User = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;

/**
 *  Saves new follow notification and emits a socket event
 * @param {String} actor - user that is generating the action
 * @param {String} receiver - user that is receiving the notification
 * @param {Object} io - socket object
 * @param {String} message - transaction message
 */
const TransactionNotification = async (actor, receiver, io, message) => {
  try {
    const sender = await Admin.findOne(
      { _id: actor },
      { name: 1, _id: 1, name: 1 }
    );

    const notification = new Notification({
      actor,
      verb: "transaction",
      message,
      subject: sender?.name || "Admin",
      receiver,
    });
    await notification.save();
    io.to(receiver.toString()).emit("new-notification", {
      actor,
      verb: "transaction",
      message,
      subject: sender?.name,
      // avatar: sender?.avatar_url,
      receiver,
    });
    await User.findOneAndUpdate(
      {
        _id: ObjectId(receiver),
      },
      {
        $inc: { notificationCount: 1 },
      },
      {
        new: true,
      }
    );
  } catch (err) {
    console.log("err in transaction notification service: ", err);
    return err;
  }
};

module.exports = TransactionNotification;
