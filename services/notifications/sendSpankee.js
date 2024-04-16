const Notification = require("../../models/Notification.model");
const Admin = require("../../models/Admin");

/**
 *  Saves new follow notification and emits a socket event
 * @param {String} actor - user that is generating the action
 * @param {String} receiver - user that is receiving the notification
 * @param {Object} io - socket object
 */
const sendSpankeeNotification = async (
  actor,
  receiver,
  io,
  notificationText
) => {
  try {
    const sender = await Admin.findOne(
      { _id: actor },
      { name: 1, _id: 1, name: 1 }
    );
    const message = `You have received a Spankee for ${notificationText || ""}`;
    const notification = new Notification({
      actor,
      verb: "spankee",
      message,
      subject: sender?.name || "Admin",
      receiver,
      notificationText,
    });
    await notification.save();
    io.to(receiver.toString()).emit("new-warning", {
      actor,
      verb: "spankee",
      message,
      subject: sender?.name,
      // avatar: sender?.avatar_url,
      receiver,
    });
  } catch (err) {
    console.log("err in warning notification service: ", err);
    return err;
  }
};

module.exports = sendSpankeeNotification;
