const express = require('express');
const app = express();
app.use(express.text());


app.get('/send', (req, res)=>{
 const x= req.body;
  alert(x)
})

app.lesten(3000, ()=>{
  alert("started")
})