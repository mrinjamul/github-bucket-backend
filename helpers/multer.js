const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "bucket/assets/");
  },
  filename: (req, file, cb) => {
    // cb(null, Date.now() + "-" + file.originalname);
    cb(null, file.originalname);
  },
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
