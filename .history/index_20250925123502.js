const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();

// connect to db
mongoose.connect("mongodb://localhost:27017/myDB", { useNewUrlParser: true, useUnifiedTopology: true });

// schema
const imageSchema = new mongoose.Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Image = mongoose.model("Image", imageSchema);

// multer setup (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// route
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const newImage = new Image({
      name: req.file.originalname,
      img: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await newImage.save();
    res.send("Image saved to DB!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log("Server started at 3000"));
