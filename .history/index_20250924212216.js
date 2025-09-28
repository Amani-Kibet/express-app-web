const express = require('express');
const app = express();
app.use(express.text());
app.use(express.static('public'))

app.post('api/send', (req, res)=>{
 const x= req.body;
})

app.lesten(3000, ()=>{
  alert("started")
})