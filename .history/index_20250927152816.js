const express= require("express");
const cors= require("cors");
const app= express();
app.use(cors())
app.use(express.json())
app.use("/pictures", express.static("pictures"))
app.use("/pages", express.static("pages"))

app.get("/", (req, res)=>{
  res.send("Hello Welcome Live")
})

app.listen(3000, ()=>console.log("Backend Started"))