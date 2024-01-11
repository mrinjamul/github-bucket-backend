var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const multer = require("multer");
const upload = require("../../helpers/multer");

// get files from the server
router.get("/", (req, res) => {
  res
    .status(constants.http.StatusNotImplemented)
    .json({ message: "in development" });
});

// upload file to the server
router.post("/upload", async (req, res) => {
  // Handle the uploaded file
  const fileUpload = upload.single("file");
  fileUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("error occured in multer while uploading");
    } else if (err) {
      console.log("error: something went wrong");
    }
    // Everything went fine.
    console.log("File uploaded successfully!");
  });
  res
    .status(constants.http.StatusOK)
    .json({ message: "File uploaded successfully!" });
});

module.exports = router;
