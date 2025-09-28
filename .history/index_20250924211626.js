const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('public'))

app.get('/send', (req, res)=>{
  x= req.body
  alert(x)
})

app.lesten(3000, ()=>{
  alert("started")
})