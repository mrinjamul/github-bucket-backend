var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const cors = require("cors");

var indexRouter = require("./routes/view");
var healthRouter = require("./routes/healthcheck");
var apiRouter = require("./routes/api");

var app = express();

// get configs
const config = require("./config").getConfig();

// get Status object
var status = require("./helpers/status").getStatus();
status.startTime = new Date();

// db client
const mongoose = require("mongoose");
// make connection to the database
mongoose
  .connect(config.database.url, {
    dbName: "github_bucket_db",
  })
  .then(() => {
    console.log("database is connected");
    const now = new Date();
    status.isDBConnected = true;
  })
  .catch((err) => console.log(err));

// get bucket directory
const { isDirExists, cmdRun } = require("./helpers/utils");

if (!isDirExists("bucket")) {
  console.log("error: directory not exist.");
  console.log(" Creating the bucket...");
  cmdRun(`git clone ${config.github.repo_url}`);
  if (!isDirExists("bucket/assets")) {
    cmdRun(`mkdir -p bucket/assets`);
  }
} else {
  cmdRun("cd bucket && git pull origin main");
  console.log("Storage data updated!");
  setInterval(() => {
    cmdRun("cd bucket && git pull origin main");
    console.log("Storage data updated!");
  }, 2 * 60 * 1000);
  if (!isDirExists("bucket/assets")) {
    cmdRun(`mkdir -p bucket/assets`);
  }
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/health", healthRouter);
app.use("/api", apiRouter);

const now = new Date();
status.isDBConnected = true;
status.bootTime = Math.abs(now - status.startTime);

/* For frontend */
app.use("/", indexRouter);

// log all endpoints
function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      print.bind(null, path.concat(split(layer.route.path)))
    );
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(
      print.bind(null, path.concat(split(layer.regexp)))
    );
  } else if (layer.method) {
    console.log(
      "%s /%s",
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join("/")
    );
  }
}

function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

app._router.stack.forEach(print.bind(null, []));

module.exports = app;
