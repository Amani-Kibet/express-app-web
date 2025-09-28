const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.text());

app.get("/receive", (req, res)=>{
  res.send("From Backend")
})
app.post("/receive", (req, res)=>{
  console.log("You received "+ req.body)
})
app.listen(3000, () => {
  console.log("Started");
});
