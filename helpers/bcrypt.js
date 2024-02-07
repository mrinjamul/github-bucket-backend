const bcrypt = require("bcrypt");

const saltRounds = 10;

async function HashAndSalt(password) {
  const hash = await bcrypt.hash(password, saltRounds).then(function (hash) {
    return hash;
  });
  return hash;
}

async function VerifyHash(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match;
}

module.exports = { HashAndSalt, VerifyHash };
