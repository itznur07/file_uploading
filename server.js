const express = require("express");
const port = 3000;
const app = express();
const multer = require("multer");
const path = require("path");

const UPLOADS_FOLDER = "./uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    // important file.pdf => important-file-4545.pdf
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "video") {
      if (file.mimetype === "video/mp4") {
        cb(null, true);
      } else {
        cb(new Error("only .mp4 and mp3 file allowed!"));
      }
    } else if (file.fieldname === "avater") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/svg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("only .png, .jpg, .jpeg, .svg file allowed!"));
      }
    } else {
      cb(new Error("There was an error!"));
    }
  },
});

// application route
app.post(
  "/",
  upload.fields([
    { name: "avater", maxCount: 3 },
    { name: "video", maxCount: 3 },
  ]),
  (req, res) => {
    res.send("Hello world");
  }
);

// error handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send(err.message);
  } else {
    res.send("Success!");
  }
});

// create server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
