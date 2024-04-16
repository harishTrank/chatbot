const Notification = require("../../models/Notification.model");
const User = require("../../models/User.model");

/**
 *  Saves new follow notification and emits a socket event
 * @param {String} actor - user that is generating the action
 * @param {String} receiver - user that is receiving the notification
 * @param {Object} io - socket object
 */
const performBountyNotification = async (receiver, message, io) => {
  const userData = await User.findById({
    _id: receiver,
  });
  try {
    // const message = `Crux ${userData?.cruxLevel} achieved`;
    const notification = new Notification({
      verb: "bounty",
      message: message + "",
      receiver,
      actor: receiver,
    });
    await notification.save();
    io.to(receiver.toString()).emit("new-notification", {
      actor: receiver,
      verb: "bounty",
      message: message + "",
      receiver,
    });
  } catch (err) {
    console.log("err in new-notification bounty service: ", err);
    return err;
  }
};

module.exports = performBountyNotification;
