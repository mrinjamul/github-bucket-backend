// get scopedtoken
const ScopedTokenGenerator = require("./scopedToken");
// get configs
const config = require("../config").getConfig();

// Initialize the token generator with your secret key
const tokenGenerator = new ScopedTokenGenerator(config.jwt.secret);

module.exports = tokenGenerator;
