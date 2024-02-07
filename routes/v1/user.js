var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const config = require("../../config").getConfig();

router.get("/profile", async (req, res) => {
  const user = req.user;
  res.status(constants.http.StatusOK).json({
    status: true,
    data: user,
  });
});

module.exports = router;
