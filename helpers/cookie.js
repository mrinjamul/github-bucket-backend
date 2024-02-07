const hour = 3600000;

const cookieConfig = {
  // httpOnly: true, // to disable accessing cookie via client side js
  // secure: true, // to force https (if you use it)
  maxAge: 12 * hour, // ttl in seconds (remove this option and cookie will die when browser is closed)
  // signed: true, // if you use the secret with cookieParser
};

module.exports = { cookieConfig };
