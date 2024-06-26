const User = require("../../../models/User.model");
const Notification = require("../../../models/Notification.model");

/**
 *  Saves new follow notification and emits a socket event
 * @param {String} actor - user that is generating the action
 * @param {String} receiver - user that is receiving the notification
 * @param {Object} io - socket object
 */
const newFollowNotification = async (actor, receiver, io) => {
  try {
    const sender = await User.findOne(
      { _id: actor },
      { name: 1, _id: 1, user_handle: 1, avatar_url: 1 }
    );

    const message = `${sender.user_handle} started following you`;
    const notification = new Notification({
      actor,
      verb: "new-follow",
      message,
      subject: sender?.user_handle,
      receiver,
    });
    await notification.save();
    io.to(receiver.toString()).emit("new-notification", {
      actor,
      verb: "new-follow",
      message,
      subject: sender?.user_handle,
      avatar: sender.avatar_url,
      receiver,
    });
  } catch (err) {
    console.log("err in new follow notification service: ", err);
    return err;
  }
};

module.exports = newFollowNotification;
