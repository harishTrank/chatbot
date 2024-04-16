const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    verb: {
      type: String,
      enum: [
        "message",
        "post",
        "rate",
        "comment",
        "Reshare",
        "Like",
        "follow-request",
        "new-follow",
        "follow-accept",
        "post-mention",
        "accept-conversation-request",
        "close-conversation-request",
        "update-conversation-price",
        "update-subscription-price",
        "cancel-subscription",
        "start-subscription",
        "new-conversation-request",
        "new-message",
        "report-post",
        "warning",
        "spankee",
        "count",
        "crux-level",
        "restore-post",
        "coin-deducted",
        "transaction",
        "bounty",
      ],
      required: true,
    },
    subject: { type: String },
    message: { type: String, required: true },
    avatar: { type: String },
    notificationText: { type: String },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isRead: { type: Boolean, required: true, default: false },
    conversationId: { type: Schema.Types.ObjectId },
    name: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Notification = model("Notification", notificationSchema, "notification");

module.exports = Notification;
