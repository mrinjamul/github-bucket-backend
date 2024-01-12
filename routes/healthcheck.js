var express = require("express");
var router = express.Router();

var constants = require("../constants");

const process = require("process");

/**
 * @swagger
 * /health:
 *    tags:
 *      name: Misc
 *      description: miscellaneous endpoints
 *    get:
 *      summary: Retrieve status of the server.
 *      description: Retrieve health status and others information.
 *      responses:
 *        200:
 *          description: health status
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: OK
 */
router.get("/", function (req, res, next) {
  const status = require("../helpers/status").getStatus();
  const { toReadableTime } = require("../helpers/status");
  const mem = process.memoryUsage();
  const memUsage = {
    rss: mem.rss / 1000000 + " MB",
    heapTotal: mem.heapTotal / 1000000 + " MB",
    heapUsed: mem.heapUsed / 1000000 + " MB",
    external: mem.external / 1000000 + " MB",
  };

  const now = new Date();
  const uptime = Math.abs(now - status.startTime);

  if (!status.isDBConnected) {
    res.status(constants.http.StatusOK).json({
      status: "unavailable",
      message: "DB is not connected",
      startTime: status.startTime,
      uptime: toReadableTime(uptime),
      system: {
        memoryUsage: memUsage,
      },
      failures: {
        mongodb: "not connected",
      },
    });
    return;
  }
  // send a OK status to the client
  res.status(constants.http.StatusOK).json({
    status: "OK",
    startTime: status.startTime,
    bootTime: status.bootTime / 1000 + " " + "sec",
    uptime: toReadableTime(uptime),
    system: {
      memoryUsage: memUsage,
    },
  });
});

module.exports = router;
