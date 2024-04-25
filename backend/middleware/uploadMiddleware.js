const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: "./images/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer middleware
const upload = multer({
  storage: storage,
  //   limits: { fileSize: 1000000 },
}).single("image");

module.exports = upload;
