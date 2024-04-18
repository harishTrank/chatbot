const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ConversationSchema = new Schema(
  {
    name: { type: String },
    avatar_url: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    type: { type: String, required: true, default: "single" },
    last_message: { type: Schema.Types.ObjectId, ref: "Message" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const Conversation = mongoose.model(
  "Conversation",
  ConversationSchema,
  "conversation"
);

// make this available to our users in our Node applications
module.exports = Conversation;
