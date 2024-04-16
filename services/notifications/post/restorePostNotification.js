const User = require("../../../models/User.model");
const Notification = require("../../../models/Notification.model");
const ReportModel = require("../../../models/Report.model");
const Admin = require("../../../models/Admin");

const { ObjectId } = require("mongoose").Types;

// const { io } = require("../../../index");

/**
 *  Saves new comment notification and emits a socket event
const { ObjectId } = require("mongoose").Types;
 * @param {String} actor - user that is generating the action
 * @param {String} receiver - user that is receiving the notification
 * @param {String} post - post id for which the notification is being sent
 * @param {String} comment - comment text for which the notification is being sent
 * @param {Object} io - socket object
 */
const restorePostNotification = async (actor, receiver, post, io) => {
  try {
    const sender = await Admin.findOne(
      { _id: actor },
      { name: 1, _id: 1, user_handle: 1, avatar_url: 1 }
    );
    const postReported = await ReportModel.aggregate([
      { $match: { post_id: ObjectId(post) } },
    ]);
    console.log(postReported, "red");

    const message = `Your post doesn't violates our Community Guidelines and has been republished.`;
    // comment.length < 15 ? comment : `${comment.slice(0, 13)}...`

    const notification = new Notification({
      actor,
      verb: "restore-post",
      message,
      subject: post,
      avatar: sender?.name || "Admin",
      receiver,
    });
    await notification.save();
    io.to(receiver.toString()).emit("new-notification", {
      actor,
      verb: "restore-post",
      message,
      subject: post,
      avatar: sender?.name || "Admin",
      receiver,
    });
  } catch (err) {
    console.log("err in new restore notification service: ", err);
    return err;
  }
};

module.exports = restorePostNotification;
