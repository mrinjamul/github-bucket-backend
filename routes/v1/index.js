var express = require("express");
var router = express.Router();

const helloRouter = require("./hello");

/* V1 API routes */

// user routes
router.use("/", helloRouter);

module.exports = router;
