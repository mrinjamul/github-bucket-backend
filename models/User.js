const mongoose = require("mongoose");

var { randomUUID } = require("crypto");

var validator = require("validator");

var timestampPlugin = require("./plugins/timestamp");

const bcrypt = require("../helpers/bcrypt");

const UserSchema = new mongoose.Schema({
  id: {
    type: "UUID",
    default: () => randomUUID(),
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isAlphanumeric(value);
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value);
    },
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
  },
  level: {
    type: Number,
    require: true,
  },
});

UserSchema.plugin(timestampPlugin);

UserSchema.pre("save", async function (next) {
  // Do the pre save task

  this.password = await bcrypt.HashAndSalt(this.password);
  if (!this.level) {
    this.level = 1;
    this.role = "user";
  } else if (this.level > 2) {
    this.role = "admin";
  } else {
    this.role = "user";
  }

  // Call the next function in the pre-save chain
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
