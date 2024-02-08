var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const config = require("../../config").getConfig();
var port = config.server.port;
var server_url = `${config.github.serv_url}:${port}/api/v1/file/`;

const querystring = require("querystring");

const multer = require("multer");
const upload = require("../../helpers/multer");
const {
  isDirExists,
  deleteFile,
  setCommitter,
  commitAndPush,
  ls,
} = require("../../helpers/utils");

const authenticated = require("../../middlewares/authenticated");

// get file information from the server
router.get("/info", authenticated("admin", ["file:read"]), async (req, res) => {
  let data = [];
  let result = await ls("bucket/assets");
  result.forEach((file) => {
    data.push({
      filename: file,
      origURL: server_url + querystring.escape(file),
      url: config.github.url + querystring.escape(file),
    });
  });
  res.status(constants.http.StatusOK).json({
    status: true,
    data: data,
  });
});

// upload file to the server
router.post(
  "/upload",
  authenticated("admin", ["file:write"]),
  async (req, res) => {
    // Handle the uploaded files
    const fileUpload = upload.array("file", 100); // Limiting to maximum 100 files, adjust as needed
    fileUpload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("error occurred in multer while uploading");
        return res
          .status(constants.http.StatusInternalServerError)
          .json({ error: "Multer error" });
      } else if (err) {
        console.log("error: something went wrong");
        return res
          .status(constants.http.StatusInternalServerError)
          .json({ error: "Something went wrong" });
      }

      // Everything went fine.
      if (isDirExists("bucket")) {
        try {
          // set committer info
          await setCommitter();
          // commit changes
          await commitAndPush();
        } catch (err) {
          console.log(err);
        }
      }

      // Access the uploaded filenames
      const uploadedFiles = req.files.map((file) => file.filename);
      uploadedFiles.forEach((uploadedFile) => {
        console.log(`${uploadedFile}: File uploaded successfully!`);
      });

      // Prepare response data for each file
      const responseData = uploadedFiles.map((filename) => ({
        filename,
        origURL: server_url + querystring.escape(filename),
        url: config.github.url + querystring.escape(filename),
      }));

      res.status(constants.http.StatusOK).json({
        status: true,
        data: responseData,
      });
    });
  }
);

router.delete(
  "/:file",
  authenticated("admin", ["file:write"]),
  async (req, res) => {
    var file = req.params.file;
    console.log(file);
    deleteFile(file)
      .then(async () => {
        // Everything went fine.
        if (isDirExists("bucket")) {
          try {
            // set committer info
            await setCommitter();
            // commit changes
            await commitAndPush(`${file}: deleted`);
          } catch (err) {
            console.log(err);
          }
        }
        res.status(constants.http.StatusOK).json({
          status: true,
          data: `${file} deleted successfully`,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(constants.http.StatusInternalServerError).json({
          status: true,
          error: error,
        });
      });
  }
);

// get files from the server
var path = require("path");
router.use(
  "/",
  authenticated("admin", ["file:read"]),
  express.static(path.join(__dirname, "../../bucket/assets"))
);

module.exports = router;
