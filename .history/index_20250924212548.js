const express = require('express');
const app = express();
app.use(express.text());
app.use(express.static('public'))

app.post('api/send', (req, res)=>{
 const x= req.body;
 console.log(`Weve received ${x}`)
})

app.listen(3000, ()=>{
  console.log("Started")
})