const Token = require("../models/Token");

const GetTokens = async (req, user) => {
  try {
    if (user) {
      return await Token.find({ username: user });
    }
    return await Token.find();
  } catch (err) {
    console.log(err);
  }
};

const CreateToken = async (req, username, t, expire) => {
  try {
    // create token in db
    let token = new Token({
      username: username,
      token: t,
      expireIn: expire,
    });
    return await token.save();
  } catch (err) {
    console.log(err);
  }
};

const DelteAllToken = async (req, username, t) => {
  try {
    // delete all token
    return await Token.deleteMany();
  } catch (err) {
    console.log(err);
  }
};

const DeleteTokenByID = async (id) => {
  try {
    return await Token.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  GetTokens,
  CreateToken,
  DeleteTokenByID,
  DelteAllToken,
};
