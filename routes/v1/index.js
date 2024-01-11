var express = require("express");
var router = express.Router();

const helloRouter = require("./hello");
const fileRouter = require("./file");

/* V1 API routes */

// user routes
router.use("/", helloRouter);
router.use("/file", fileRouter);

module.exports = router;
