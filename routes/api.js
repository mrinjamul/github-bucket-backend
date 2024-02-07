var express = require("express");
var router = express.Router();

var v1Router = require("./v1");
var authRouter = require("./auth");

/* API routes */
router.use("/v1", v1Router);
router.use("/auth", authRouter);

module.exports = router;
