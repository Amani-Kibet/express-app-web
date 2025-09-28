const express = require("express");
const cors = require("cors");
const app = express();
const mongoose= require("mongoose")
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/database1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Database Conncted"))
.catch(err=> console.log(err))

const labels= new mongoose.Schema({
  name: String,
  age: Number
})
const Students= mongoose.model("Students", labels)
try {
  const students = await Student.find({ name: 'Rick' });
  console.log(students);
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Server Error' });
}

app.listen(3000, () => {
  console.log("Started");
});
