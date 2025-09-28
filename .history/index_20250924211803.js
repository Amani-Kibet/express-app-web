const express = require('express');

const app = express();
app.use(express.text());
app.use(express.static('public'))

app.get('/send', (req, res)=>{
 let x= req.body;
  alert(x)
})

app.lesten(3000, ()=>{
  alert("started")
})