const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

const uuidv4 = require("uuid/v4");
const path = require("path");

const Multer = require("multer");

try {
  var keyFile = require("../config/keyFile");
} catch (ex) {
  console.log(ex);
}

const projectId = "openrecipebook";
const bucketName = "openrecipebook.appspot.com";

if (process.env.FIREBASE) {
  var private_key = process.env.private_key.replace(/\\n/g, "\n");
}

const gcs = require("@google-cloud/storage")({
  projectId,
  credentials: {
    private_key: process.env.FIREBASE ? private_key : keyFile.private_key,
    client_email: process.env.FIREBASE
      ? process.env.client_email
      : keyFile.client_email
  }
});

const bucket = gcs.bucket(bucketName);

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  },
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  }
});

router.post("/upload", multer.single("file"), (req, res) => {
  let file = req.file;
  if (file) {
    uploadImageToStorage(file)
      .then(success => {
        res.json({ data: success });
      })
      .catch(error => {
        console.error(error);
      });
  }
});

const uploadImageToStorage = file => {
  let prom = new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = uuidv4() + file.originalname;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on("error", error => {
      console.log(error);
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
      const url =
        "https://firebasestorage.googleapis.com/v0/b/" +
        bucket.name +
        "/o/" +
        encodeURIComponent(fileUpload.name) +
        "?alt=media&token=";
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
  return prom;
};

module.exports = router;
