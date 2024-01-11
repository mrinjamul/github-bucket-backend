var express = require("express");
var router = express.Router();

const constants = require("../../constants");

router.get("/hello", async (req, res, next) => {
  res.status(constants.http.StatusOK).json({ message: "Hi" });
});

module.exports = router;
