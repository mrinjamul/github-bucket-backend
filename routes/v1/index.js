var express = require("express");
var router = express.Router();

const authenticated = require("../../middlewares/authenticated");

const fileRouter = require("./file");
const tokenRouter = require("./token");
const userRouter = require("./user");

/* V1 API routes */

// files routes
router.use("/file", fileRouter);
router.use("/token", authenticated("admin"), tokenRouter);
router.use("/user", authenticated("user"), userRouter);

module.exports = router;
