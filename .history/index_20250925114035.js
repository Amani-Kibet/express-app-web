const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();

app.use(cors());
app.use(express.json());

// Set up storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // unique filename
  }
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file); // info about uploaded file
  res.json({ message: "Image uploaded successfully!", file: req.file });
});

app.listen(3000, () => console.log("Server running on port 3000"));
