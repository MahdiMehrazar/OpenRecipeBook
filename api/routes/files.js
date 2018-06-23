const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const passport = require("passport");

const uuidv4 = require("uuid/v4");
const path = require("path");

const Multer = require("multer");

try {
  var keyFile = require("../config/keyFile");
} catch (ex) {
  console.log(ex);
}

//Firebase details
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

//Use multer to handle form data
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

//Upload image route
router.post(
  "/upload",
  multer.single("file"),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let file = req.file;
    let username = req.user.username;
    if (file) {
      uploadImageToStorage(file, username)
        .then(success => {
          res.json({ data: success });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
);

//Delete image route
router.delete(
  "/delete/:fileName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var fileName = req.params.fileName;
    let username = req.user.username;
    if (fileName) {
      checkImageOwner(fileName, username);
    }
  }
);

//Upload image to firebase bucket
const uploadImageToStorage = (file, username) => {
  let prom = new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = uuidv4() + file.originalname;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          user: username
        }
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

//Check image ownership
const checkImageOwner = (fileName, username) => {
  let file = bucket
    .file(fileName)
    .getMetadata()
    .then(results => {
      const metadata = results[0];
      if (metadata.metadata.user == username) {
        deleteImage(fileName, username);
      } else {
        console.log("You do not have permission to delete this image.")
      }
    })
    .catch(error => {
      console.error(error);
    });
};

//Delete image
function deleteImage(fileName, username) {
  let file = bucket.file(fileName);

  const del = file
    .delete()
    .then(() => {
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = router;
