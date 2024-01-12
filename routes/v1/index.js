var express = require("express");
var router = express.Router();

const fileRouter = require("./file");

/* V1 API routes */

// files routes
router.use("/file", fileRouter);

module.exports = router;
