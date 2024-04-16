const { Schema, model } = require("mongoose");

const { refreshTokenLife } = require("../config/keys").jwt;

const tokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "testUsers",
  },
  token: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    expires: refreshTokenLife,
    default: Date.now,
  },
  password: {
    type: String,
    require: true,
  },
});

const Token = model("testtoken", tokenSchema, "testtoken");

module.exports = Token;
