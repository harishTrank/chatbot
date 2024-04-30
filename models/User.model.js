const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    employeeId: { type: String },
    email: {
      type: String,
      unique: true,
    },
    avatar_url: { type: String },
    cover_url: { type: String },
    gender: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    isDeleted: { type: Boolean },
    notificationCount: { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    socketId: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User = model("user", userSchema, "user");

// make this available to our users in our Node applications
module.exports = User;
