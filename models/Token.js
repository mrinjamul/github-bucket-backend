const mongoose = require("mongoose");

var timestampPlugin = require("./plugins/timestamp");

const TokenSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

TokenSchema.plugin(timestampPlugin);

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;
