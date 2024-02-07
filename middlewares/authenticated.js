const jwt = require("../helpers/jwt");
const constants = require("../constants");

const tokenGenerator = require("../helpers/token");

const authenticated = (role, permissions) => {
  return (req, res, next) => {
    var token;

    try {
      token = req.headers.authorization.split(" ")[1];
    } catch (err) {
      // console.log("error: failed to get token from header");
    }

    if (permissions) {
      const accessToken = tokenGenerator.verifyToken(token);
      const hasPermissions = tokenGenerator.validatePermission(
        token,
        permissions
      );
      if (hasPermissions) {
        req.user = accessToken;
        next();
        return;
      }
      if (role == "token") {
        res.status(constants.http.StatusUnauthorized).json({
          code: constants.http.StatusUnauthorized,
          error: "invalid token",
          message: "Unauthorized",
        });
        return;
      }
    }

    // get cookie
    token = req.cookies.token;
    // if unable to get token
    if (!token) {
      res.status(constants.http.StatusUnauthorized).json({
        code: constants.http.StatusUnauthorized,
        error: "token not provided",
        message: "Unauthorized",
      });
      return;
    }

    var verifyOpts = jwt.getVerifyingOptions();
    // decode and verify jwt token
    const decodedToken = jwt.verifyToken(token, verifyOpts);
    // decodedToken is null
    if (!decodedToken) {
      res.status(constants.http.StatusUnauthorized).json({
        code: constants.http.StatusUnauthorized,
        error: "invalid token",
        message: "Unauthorized",
      });
    } else {
      // check for role
      // if admin required role
      if (role == "admin") {
        if (decodedToken.role != "admin" || decodedToken.accessLevel < 3) {
          res.status(constants.http.StatusUnauthorized).json({
            code: constants.http.StatusUnauthorized,
            error: "admin required",
            message: "Unauthorized",
          });
        } else {
          // set payload to the request
          req.user = decodedToken;
          next();
        }
        // check for user role
      } else if (role == "user") {
        // set payload to the request
        req.user = decodedToken;
        next();
      } else {
      }
    }
  };
};

module.exports = authenticated;
