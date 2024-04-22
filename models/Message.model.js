const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const readByRecipientSchema = new Schema(
  {
    _id: false,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    read_at: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

const MessageSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["text", "image", "video", "audio", "post", "document"],
    },
    message: { type: String },
    image: { type: String },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    read_by: [readByRecipientSchema],
    deleted_by: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const Message = mongoose.model("Message", MessageSchema, "message");

// make this available to our users in our Node applications
module.exports = Message;
