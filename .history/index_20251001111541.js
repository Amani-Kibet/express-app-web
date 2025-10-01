const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose")
const multer= require("multer")
const app= express();
app.use(cors())
app.use(express.json())
app.use("/pictures", express.static("pictures"))
app.use("/pages", express.static("pages"))

mongoose.connect("mongodb+srv://Amani:unity@cluster0.ou1cn67.mongodb.net/myDatabase?retryWrites=true&w=majority")
.then(()=> console.log("Database Connected Successfully"))
.catch(err=> console.log("Database Failed: "+ err))

let labels= new mongoose.Schema({name: String, phone: String, password: String, piclink: String, dob: Number, country: String, county: String, label: String, message: String})
let contacts= mongoose.model("User Contacts", labels)

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
  let user= new contacts({name: json.name, phone: json.phone, password: json.pass, piclink: `${new Date().getMinutes()}-${req.file.originalname}`, dob: json.dob, country: `${json.country}`, county: `${json.county}`, label: `${json.label}`})
  user.save()
  res.json({feedback: `${json.name}  Received and Saved✅`})
})

app.post("/chat/path1", async (req, res)=>{
  let arr1= await contacts.find({phone: req.body.phone, password: req.body.pass});
  if(arr1.length==0){arr1=[{name: "Null"}]}
  res.json({info1: arr1[0]})
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
  <title>Unity Welcome</title>
  <style>
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  /* Overlay */
  #overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0; visibility: hidden;
    transition: opacity 0.6s ease;
    z-index: 1000;
  }
  #overlay.show {
    opacity: 1; visibility: visible;
  }
  
  /* Popup */
  #popup {
    background: linear-gradient(135deg, #ff5e62, #ff8c42);
    padding: 3rem 4rem;
    border-radius: 20px;
    text-align: center;
    color: white;
    box-shadow: 0 0 25px rgba(255, 94, 98, 0.8),
                0 0 50px rgba(255, 140, 66, 0.6);
    transform: scale(0) rotate(-10deg);
    animation: bounceIn 1s forwards ease-in-out;
    max-width: 90%;
    position: relative;
  }
  
  /* Neon text animation */
  #popup h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 10px #fff, 
                 0 0 20px #00c6ff, 
                 0 0 40px #00c6ff, 
                 0 0 80px #00c6ff;
    animation: neonPulse 2s infinite alternate;
  }
  
  /* Typing text */
  #typing {
    font-size: 1.3rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 10px #ff5e62, 0 0 20px #ff8c42;
    min-height: 2rem;
  }
  
  /* Animations */
  @keyframes bounceIn {
    0% { transform: scale(0) rotate(-20deg); opacity: 0; }
    60% { transform: scale(1.1) rotate(10deg); opacity: 1; }
    80% { transform: scale(0.95) rotate(-5deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  
  @keyframes neonPulse {
    from { text-shadow: 0 0 10px #00c6ff, 0 0 20px #ff5e62; }
    to { text-shadow: 0 0 20px #fff, 0 0 40px #ff8c42; }
  }
  
  /* Close button */
  #closeBtn {
    position: absolute;
    top: 1rem; right: 1rem;
    background: none;
    border: none;
    font-size: 1.8rem;
    color: white;
    cursor: pointer;
    transition: transform 0.2s;
  }
  #closeBtn:hover { transform: scale(1.2) rotate(10deg); }
  </style>
  </head>
  <body>
  <div id="overlay">
    <div id="popup">
      <button id="closeBtn">&times;</button>
      <h2>🌐 Unity Global Connect</h2>
      <div id="typing"></div>
    </div>
  </div>
  
  <script>
  const overlay = document.getElementById("overlay");
  const typingEl = document.getElementById("typing");
  const closeBtn = document.getElementById("closeBtn");
  
  window.addEventListener("load", () => {
    overlay.classList.add("show");
    startTyping();
  });
  
  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
    window.location.href="/pages/home.html"
  });
  
  // Typing + deleting effect
  const messages = [
    "Welcome to Unity",
    "Connect to anyone globally",
    "Fast and secure",
    "Share the link to connect...",
    "Starting..."
  ];
  let msgIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function startTyping() {
    const currentMsg = messages[msgIndex];
    if (!isDeleting) {
      typingEl.textContent = currentMsg.slice(0, charIndex++);
      if (charIndex > currentMsg.length) {
        isDeleting = true;
        setTimeout(startTyping, 1000);
        return;
      }
    } else {
      typingEl.textContent = currentMsg.slice(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        msgIndex++;
        if (msgIndex >= messages.length) {
          // Redirect after "Starting..."
          setTimeout(() => window.location.href="/pages/home.html", 2000);
          return;
        }
      }
    }
    setTimeout(startTyping, isDeleting ? 60 : 100);
  }
  </script>
  </body>
  </html>
    `);
  });  

  app.listen(process.env.PORT || 3000, ()=>console.log("Backend Started"))