var User = require("../models/User");

var bcrypt = require("../helpers/bcrypt");

// CreateUser: creates a user in db
const CreateUser = async (req) => {
  try {
    const { username, email, password } = req.body;
    let user = new User({
      username: username,
      email: email,
      password: password,
    });
    // get users
    const users = await GetAllUser();

    if (users.length == 0) {
      user.level = 3;
      return await user.save();
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

// GetAllUser: fetch all users from db
const GetAllUser = async (req) => {
  try {
    return await User.find();
  } catch (err) {
    console.log(err);
  }
};

// GetUserByID: fetch a user from db
const GetUserByID = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    console.log(err);
  }
};

// GetUserByUserName: fetch a user by username from db
const GetUserByUserName = async (username) => {
  try {
    return await User.findOne({ username: username });
  } catch (err) {
    console.log(err);
  }
};

// GetUserByEmail: fetch a user by email from db
const GetUserByEmail = async (email) => {
  try {
    return await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }
};

// UpdateUserByID: update a user in db
const UpdateUserByID = async (id, user) => {
  try {
    // get updatable fields
    const { fullName, username, email, password } = user;

    // check for null fields and update field one by one
    let usr = {};
    if (fullName) {
      usr.fullName = fullName;
    }
    if (email) {
      usr.email = email;
    }

    return await User.findByIdAndUpdate(id, usr, {
      new: true,
    });
  } catch (err) {
    console.log(err);
  }
};

// DeleteUserByID: delete a user from db
const DeleteUserByID = async (id) => {
  try {
    return await User.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  CreateUser,
  GetAllUser,
  GetUserByID,
  GetUserByUserName,
  GetUserByEmail,
  UpdateUserByID,
  DeleteUserByID,
};
