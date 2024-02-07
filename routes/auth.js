var express = require("express");
var router = express.Router();

// import http constants
var constants = require("../constants");

// import helpers
const bcrypt = require("../helpers/bcrypt");
const { cookieConfig } = require("../helpers/cookie");
const {
  getPayload,
  getSigningOptions,
  issueToken,
  getVerifyingOptions,
  verifyToken,
} = require("../helpers/jwt");

// import Controllers
const {
  CreateUser,
  GetUserByUserName,
  GetUserByEmail,
} = require("../controllers/users");

/**
 * @swagger
 * /api/v1/auth/signup:
 *    post:
 *      summary: Register user
 *      description: Register a user.
 *      parameters:
 *        - in : body
 *          name: user
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              fullName:
 *                type: string
 *              email:
 *                type: string
 *              username:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        400:
 *          description: bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  error:
 *                    type: string
 *                  message:
 *                    type: string
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  error:
 *                    type: string
 *                  message:
 *                    type: string
 *        201:
 *          description: Create a user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  user:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      firstName:
 *                        type: string
 *                      middleName:
 *                        type: string
 *                      lastName:
 *                        type: string
 *                      email:
 *                        type: string
 *                      username:
 *                        type: string
 *                      created_at:
 *                        type: string
 *                      updated_at:
 *                        type: string
 */
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  // check for required values;
  if (!username || !email || !password) {
    res.status(constants.http.StatusBadRequest).json({
      code: constants.http.StatusBadRequest,
      error: "Bad Request",
      message: "missing fields",
    });
    return;
  }

  // after validation, create user into the db
  const user = await CreateUser(req);
  // if err occurs then return with error
  if (!user) {
    res.status(constants.http.StatusInternalServerError).json({
      code: constants.http.StatusInternalServerError,
      error: "something went wrong",
      message: "cannot create user account.",
    });
    return;
  }

  res.status(constants.http.StatusCreated).json({
    message: "success",
    user: user,
  });
});

/**
 * @swagger
 * /api/v1/auth/login:
 *    post:
 *      summary: Login user
 *      description: Login the user.
 *      parameters:
 *        - in : body
 *          name: user
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              username:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        400:
 *          description: bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  error:
 *                    type: string
 *                  message:
 *                    type: string
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  error:
 *                    type: string
 *                  message:
 *                    type: string
 *        200:
 *          description: Return a token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  token:
 *                    type: string
 */
router.post("/login", async (req, res, next) => {
  // get login credentials
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    res.status(constants.http.StatusBadRequest).json({
      code: constants.http.StatusBadRequest,
      error: "Bad Request",
      message: "username or email is missing",
    });
    return;
  }
  // get cookie
  const token = req.cookies.token;
  if (token) {
    //FIXME: regenerate token if expired
    var verifyOpts = getVerifyingOptions();
    // decode and verify jwt token
    const decodedToken = verifyToken(token, verifyOpts);
    // decodedToken is null
    if (!decodedToken) {
      // clear token cookie
      res.clearCookie("token");
      res.status(constants.http.StatusUnauthorized).json({
        code: constants.http.StatusUnauthorized,
        error: "invalid token; please login again",
        message: "Unauthorized",
      });
    }
    res.status(constants.http.StatusOK).json({
      message: "user already logged in",
      token: token,
    });
    return;
  }
  // get user informations
  let user;
  if (email) {
    user = await GetUserByEmail(email);
  } else if (username) {
    user = await GetUserByUserName(username);
  }
  if (!user) {
    res.status(constants.http.StatusNotFound).json({
      code: constants.http.StatusNotFound,
      error: "not found",
      message: "user does not exists",
    });
    return;
  }
  // validate user password
  const isVerified = await bcrypt.VerifyHash(password, user.password);
  if (isVerified) {
    // generate token
    var payload = getPayload(user);
    const subject = user.id;
    var signOpts = getSigningOptions(subject);
    let token = issueToken(payload, signOpts);
    // set token to cookie
    res.cookie("token", token, cookieConfig);
    const usr = {
      _id: user._id,
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      level: user.level,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    res.status(constants.http.StatusOK).json({
      message: "success",
      token: token,
      user: usr,
    });
    return;
  } else {
    res.status(constants.http.StatusBadRequest).json({
      code: constants.http.StatusBadRequest,
      error: "invalid request",
      message: "invalid password",
    });
    return;
  }
});

/**
 * @swagger
 * /api/v1/auth/logout:
 *    get:
 *      summary: Logout
 *      description: Logout the user.
 *      responses:
 *        400:
 *          description: bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  error:
 *                    type: string
 *                  message:
 *                    type: string
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  error:
 *                    type: string
 *                  message:
 *                    type: string
 *        200:
 *          description: Return a message
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 */
router.get("/logout", (req, res, next) => {
  // get cookie
  const token = req.cookies.token;
  if (!token) {
    res.status(constants.http.StatusOK).json({
      message: "user not logged in",
    });
    return;
  }
  // clear token cookie
  res.clearCookie("token");
  res.status(constants.http.StatusOK).json({
    message: "success",
  });
});

module.exports = router;
