const express = require("express");
const cors= require("cors");
const multer= require("multer");
const app= express();

app.use(cors())
app.use(express.json())



app.listen(3000, ()=>{console.log("Backend Started")})