const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();

app.use(cors());

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage1 });

app.post("/path1", upload.any(), (req, res) => {
  console.log(req.file);
});

app.listen(3000, () => console.log("Backend Started"));
