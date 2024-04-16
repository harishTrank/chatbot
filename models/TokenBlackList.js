const { Schema, model } = require("mongoose");

const blacklist = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
});

const blacklistToken = model("testblacklist", blacklist, "testblacklist");

module.exports = blacklistToken;
