const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose")
const multer= require("multer")
const app= express();
app.use(cors())
app.use(express.json())
app.use("/pictures", express.static("pictures"))
app.use("/pages", express.static("pages"))

mongoose.connect("mongodb://localhost:27017/Users")
.then(()=> console.log("Database Connected Successfully"))
.catch(err=> console.log("Database Failed: "+ err))

let labels= new mongoose.Schema({name: String, phone: String, password: String, piclink: String, message: String})
let contacts= mongoose.model("User Contacts", labels)

let labels2= new mongoose.Schema({input: String, output: String})
let responses= mongoose.model("Responses", labels2)

let storage1= multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "pictures/")
  },
  filename: (req, file, cb)=>{
    cb(null, `${new Date().getMinutes()}-${file.originalname}`)
  }
})

filex= multer({storage: storage1})
app.post("/sign/path1", filex.single("image"), (req, res)=>{
  let json= JSON.parse(req.body.json)
  console.log(req.file.path);
  let user= new contacts({name: json.name, phone: json.phone, password: json.pass, piclink: `${new Date().getMinutes()}-${req.file.originalname}`})
  user.save()
  res.json({feedback: `${json.name}  Received and Saved✅`})
})

app.post("/chat/path1", async (req, res)=>{
  let arr1= await contacts.find({phone: req.body.phone, password: req.body.pass});
  let arra;
  if(arr1.length==0){arr1=[{name: "Null"}]} else{arra=arr1}
  let arr2= await contacts.find({phone: req.body.phone2});
  console.log(arr2)
  res.json({info1: arr1[0], info2: arr2[0]})
})

app.post("/chat/path2", async (req, res)=>{
  await contacts.updateOne(
    {phone: req.body.phone2},
    {$set: {message: `${req.body.input}`}}
  )
})

app.post("/chat/path3", async (req, res)=>{
  let arr3= await contacts.find({phone: req.body.phone1});
  res.json({msg: arr3[0].message})
})

app.post("/path3", async (req, res)=>{
  var arr= await contacts.find({name: `${req.body.name}`});
  res.json({arr: arr})
  console.log(arr)
  })

  app.get("/path/online", async (req, res) => {
    let arr4= await contacts.find();
    res.json({everyone: arr4});
  });
 
  app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Popup Example</title>
<style>
body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
#overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease;
    z-index: 1000;
}
#overlay.show {
    opacity: 1;
    visibility: visible;
}
#popup {
    background: linear-gradient(135deg, #ff8c42, #ff5e62);
    padding: 2rem 3rem;
    border-radius: 20px;
    text-align: center;
    color: white;
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    transform: scale(0);
    transition: transform 0.3s ease;
    max-width: 90%;
}
#overlay.show #popup {
    transform: scale(1);
}
#popup h2 {
    margin-bottom: 1rem;
}
#popup button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 12px;
    background: #fff;
    color: #ff5e62;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.3s ease;
}
#popup button:hover {
    transform: scale(1.05);
    background: #ffe5e0;
}
#closeBtn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: white;
    cursor: pointer;
}
@media (max-width: 500px) {
    #popup {
        padding: 1.5rem 2rem;
    }
}
</style>
</head>
<body>
<div id="overlay">
    <div id="popup">
        <button id="closeBtn">&times;</button>
        <h2>Looking for Unity Connect?</h2>
        <button id="goBtn">Click Here</button>
    </div>
</div>
<script>
const overlay = document.getElementById("overlay");
const goBtn = document.getElementById("goBtn");
const closeBtn = document.getElementById("closeBtn");
window.addEventListener("load", () => {
    overlay.classList.add("show");
});
goBtn.addEventListener("click", () => {
    window.location.href = "/pages/home.html";
});
closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
});
overlay.addEventListener("click", (e) => {
    if(e.target === overlay){
        overlay.classList.remove("show");
    }
});
</script>
</body>
</html>
    `);
});


  app.listen(process.env.PORT || 3000, ()=>console.log("Backend Started"))