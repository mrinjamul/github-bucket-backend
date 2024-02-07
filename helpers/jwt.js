const jwt = require("jsonwebtoken");

const config = require("../config").getConfig();

// default signing options
const issuer = "GHB";
const audience = "ALL";
const expireIn = 3 * 24 * 60 * 60;

// default payload
function getPayload(user) {
  var payload = {
    userID: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    accessLevel: user.level,
    iat: Math.floor(Date.now() / 1000),
    // exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
  };
  return payload;
}

// signOptions
function getSigningOptions(subject, algo) {
  // Initialize algorithm
  if (!algo || algo === "") {
    algo = "HS256";
  }
  var signOptions = {
    issuer: issuer,
    subject: subject,
    audience: audience,
    expiresIn: expireIn,
    // expiresIn: "12h",
    algorithm: algo,
  };
  return signOptions;
}

// verifyOptions
function getVerifyingOptions(algo) {
  // Initialize algorithm
  if (!algo || algo === "") {
    algo = "HS256";
  }
  var verifyOptions = {
    issuer: issuer,
    audience: audience,
    expiresIn: expireIn,
    // expiresIn: "12h",
    algorithm: algo,
  };
  return verifyOptions;
}

function issueToken(payload, signingOpts) {
  var token;
  if (signingOpts) {
    token = jwt.sign(payload, config.jwt.secret, signingOpts);
  } else {
    token = jwt.sign(payload, config.jwt.secret);
  }
  return token;
}

function verifyToken(token, verifyOpts) {
  var payload;
  if (verifyOpts) {
    payload = jwt.verify(token, config.jwt.secret, verifyOpts);
  } else {
    payload = jwt.verify(token, config.jwt.secret);
  }
  return payload;
}

module.exports = {
  getPayload,
  getSigningOptions,
  issueToken,
  getVerifyingOptions,
  verifyToken,
};
