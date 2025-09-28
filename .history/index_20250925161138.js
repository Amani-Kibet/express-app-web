const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();

app.use(cors());
app.use(express.json());

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileN = multer({ storage: storage1 });

app.post("/upload", fileN.single("image"), (req, res) => {
  console.log(req.file);
});

app.listen(3000, () => console.log("Server running on port 3000"));
