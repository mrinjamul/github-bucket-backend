var express = require("express");
var router = express.Router();

var path = require("path");

/* GET home page. */

router.use("/assets", express.static(path.join(__dirname, "../ui/assets")));
// all unmatched requests to this path, with no file extension, redirect to the dash page
router.use("/login", function (req, res, next) {
  // uri has a forward slash followed any number of any characters except full stops (up until the end of the string)
  if (/\/[^.]*$/.test(req.url)) {
    res.status(200).sendFile(path.join(__dirname, "../ui/login.html"));
  } else {
    next();
  }
});
router.use("/signup", function (req, res, next) {
  // uri has a forward slash followed any number of any characters except full stops (up until the end of the string)
  if (/\/[^.]*$/.test(req.url)) {
    res.status(200).sendFile(path.join(__dirname, "../ui/signup.html"));
  } else {
    next();
  }
});
router.use("/app", function (req, res, next) {
  // uri has a forward slash followed any number of any characters except full stops (up until the end of the string)
  if (/\/[^.]*$/.test(req.url)) {
    res.status(200).sendFile(path.join(__dirname, "../ui/dashboard.html"));
  } else {
    next();
  }
});
router.use("/settings", function (req, res, next) {
  // uri has a forward slash followed any number of any characters except full stops (up until the end of the string)
  if (/\/[^.]*$/.test(req.url)) {
    res.status(200).sendFile(path.join(__dirname, "../ui/settings.html"));
  } else {
    next();
  }
});
router.use(["/", "/*"], function (req, res, next) {
  // uri has a forward slash followed any number of any characters except full stops (up until the end of the string)
  if (/\/[^.]*$/.test(req.url)) {
    res.status(200).sendFile(path.join(__dirname, "../ui/index.html"));
  } else {
    next();
  }
});

module.exports = router;
