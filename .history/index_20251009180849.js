const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const axios= require("axios");
const fs= require("fs");
const FormData= require("form-data");
const bcrypt = require("bcrypt");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const path = require('path');

app.use(cors())
app.use(express.json())
app.use("/pictures", express.static("pictures"))
app.use("/pages", express.static("pages"))
app.use("/sounds", express.static("sounds"))


mongoose.connect("mongodb+srv://Amani:unity@cluster0.ou1cn67.mongodb.net/myDatabase?retryWrites=true&w=majority")
.then(()=> console.log("Database Connected Successfully"))
.catch(err=> console.log("Database Failed: "+ err))

let labels1 = new mongoose.Schema({
  name: String,
  phone: String,
  password: String,
  piclink: String,
  dob: Number,
  country: String,
  county: String,
  label: String,
  friends: String,
  email: String,
  age: Number,
  gender: String,
  gallery: [String] // 👈 array of URLs for uploaded images
});

let contacts= mongoose.model("User Contacts", labels1)

let labels2= new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  time: String,
  read: { type: Boolean, default: false } // new field
});

let messages= mongoose.model("Messages", labels2)

const filex = multer({ dest: "uploads/" });
const IMGBB_API_KEY = "60674b27502af3f803a73df6524b810e";

app.post("/sign/path1", filex.single("image"), async (req, res) => {
  try {
    let json = JSON.parse(req.body.json);

    // Read the file and convert to base64
    const imageFile = fs.readFileSync(req.file.path, { encoding: "base64" });

    // Prepare form for ImgBB
    const form = new FormData();
    form.append("image", imageFile);
    form.append("key", IMGBB_API_KEY);

    // Upload to ImgBB
    const response = await axios.post("https://api.imgbb.com/1/upload", form, {
      headers: form.getHeaders(),
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    // Get ImgBB URL
    const imgUrl = response.data.data.url;

    // Save to your database
    let user = new contacts({
      name: json.name,
      phone: json.phone,
      password: json.pass,
      piclink: imgUrl,  // <-- ImgBB URL here
      dob: json.dob,
      country: json.country,
      county: json.county,
      label: json.label,
      friends: ""
    });

    await user.save();

    res.json({ feedback: `${json.name} Received and Saved✅`, imgUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("Upload failed ❌");
  }
});

app.post("/chat/path1", async (req, res)=>{
  let arr1= await contacts.find({phone: req.body.phone1, password: req.body.pass});
  if(arr1.length==0){arr1=[{name: "Null"}]}
  res.json({info1: arr1[0]})
})


io.on("connection", (socket) => {
  console.log("Device Connected");

  socket.on("message", async (msg) => {

    // Save to DB
    let message = new messages({
      sender: msg.from,
      receiver: msg.to,
      message: msg.text,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`
    });
    await message.save();

    // Send back a full object so client can filter
    io.emit("serverReply", {
      from: msg.from,
      to: msg.to,
      text: `[🙎 ${msg.fromName}]-   ${msg.text}`
    });
  });
});


app.post("/interest/status", async (req, res)=>{
  var arr= await contacts.find({phone: `${req.body.phone2}`});
  let ints= arr[0].friends;

  let status;
  let intsA = ints
  .split(",")
  .map(p => p.trim())
  .filter(p => p !== "");
  if(intsA.includes(req.body.phone1)){
    status= "interested"
  } else{
    status= "null"
  }
  res.json({status: status})
})

app.post("/chat/path3", async (req, res)=>{
  let arr3= await contacts.find({phone: req.body.phone1});
  res.json({msg: arr3[0].message})
})

app.post("/path3", async (req, res)=>{
  var arr= await contacts.find({name: `${req.body.name}`});
  res.json({arr: arr})
  })

  app.get("/path/everyone", async (req, res) => {
    let arr4= await contacts.find();
    res.json({everyone: arr4});
  });

  app.post("/chat/path4", async (req, res)=>{
    let arr5= await messages.find({sender: req.body.phone2, receiver: req.body.phone1});
    let arr6= await messages.find({sender: req.body.phone1, receiver: req.body.phone2});
    res.json({msgReceivedD: arr5, msgSentD: arr6})
  })

 
  // Update friends of phone2 only
app.post("/friends/path1", async (req, res) => {
  try {
    const { phone1, phone2, action } = req.body;

    // Find the user whose friends list will be updated
    const user = await contacts.findOne({ phone: phone2 });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Convert friends list to array
    let friendsArray = (user.friends || "")
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    // Add or remove phone1
    if (action === "add") {
      if (phone1 && phone1 !== phone2 && !friendsArray.includes(phone1)) {
        friendsArray.push(phone1);
      }
    } else if (action === "remove") {
      friendsArray = friendsArray.filter(p => p !== phone1);
    }

    // Save updated list
    user.friends = friendsArray.join(",");
    await user.save();

    // Return updated friend data
    const friendsData = await contacts.find({ phone: { $in: friendsArray } });
    res.json({ friends: friendsData });
  } catch (err) {
    console.error("❌ Error updating friends:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current friends of a user
// Get friends as full objects
app.post("/friends/list", async (req, res) => {
    try {
        let phone1 = req.body.phone1;
        let user = await contacts.findOne({ phone: phone1 });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Split friends string into array
        let friendsPhones = [];
        if (user.friends && user.friends.length > 0) {
            friendsPhones = user.friends.split(",").map(p => p.trim());
        }

        // Fetch full friend objects
        let friends = await contacts.find(
            { phone: { $in: friendsPhones } }, 
            { name: 1, phone: 1, piclink: 1, label: 1, _id: 0 }
        );

        res.json({ friends: friends });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


app.post("/inbox", async (req, res) => {
  const phone = req.body.phone;

  // Get all messages sent to this user
  const msgs = await messages.find({ receiver: phone });

  // Group by sender
  const inbox = {};
  msgs.forEach(msg => {
    if (!inbox[msg.sender]) {
      inbox[msg.sender] = {
        sender: msg.sender,
        count: 0,
        lastMessage: msg.message,
        lastTime: msg.time
      };
    }

    // Always update last message/time to the latest
    if (new Date(msg.time) > new Date(inbox[msg.sender].lastTime)) {
      inbox[msg.sender].lastMessage = msg.message;
      inbox[msg.sender].lastTime = msg.time;
    }

    // Count unread messages
    if (!msg.read) inbox[msg.sender].count++;
  });

  // Get sender info
  let result = await Promise.all(
    Object.values(inbox).map(async item => {
      const user = await contacts.findOne({ phone: item.sender });
      return {
        phone: item.sender,
        name: user.name,
        piclink: user.piclink,
        lastMessage: item.lastMessage,
        lastTime: item.lastTime,
        unreadCount: item.count
      };
    })
  );

  // 🧩 SORT: Unread first, then by latest message time
  result.sort((a, b) => {
    // 1️⃣ Unread chats first
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

    // 2️⃣ Then by latest message time
    return new Date(b.lastTime) - new Date(a.lastTime);
  });

  res.json({ inbox: result });
});

app.post("/markAsRead", async (req, res) => {
  const { userPhone, senderPhone } = req.body;

  try {
    await messages.updateMany(
      { receiver: userPhone, sender: senderPhone, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/confirm-user", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if(!phone || !password){
      return res.json({ success: false, message: "Please provide phone and password ❌" });
    }

    // Directly find the user by phone AND password
    let arr = await contacts.find({ phone: phone, password: password });

    if(arr.length === 0){
      return res.json({ success: false, message: "Incorrect phone or password ❌" });
    }

    // User found
    res.json({ success: true, userId: arr[0]._id, info: arr[0] });

  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
});



app.post("/update-profile", filex.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "photos", maxCount: 6 }
]), async (req, res) => {
  try {
    const { userId, name, phone, email, age, gender, county, password, label } = req.body;
    const user = await contacts.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found ❌" });

    const uploadedUrls = [];

    // ✅ Upload profile picture (single)
    if (req.files?.profilePic?.length > 0) {
      const imageFile = fs.readFileSync(req.files.profilePic[0].path, { encoding: "base64" });
      const form = new FormData();
      form.append("image", imageFile);
      form.append("key", IMGBB_API_KEY);

      const response = await axios.post("https://api.imgbb.com/1/upload", form, {
        headers: form.getHeaders(),
      });
      fs.unlinkSync(req.files.profilePic[0].path);
      user.profilePic = response.data.data.url; // store profile picture link
    }

    // ✅ Upload gallery photos
    if (req.files?.photos?.length > 0) {
      for (const file of req.files.photos) {
        const img = fs.readFileSync(file.path, { encoding: "base64" });
        const form = new FormData();
        form.append("image", img);
        form.append("key", IMGBB_API_KEY);
        const res2 = await axios.post("https://api.imgbb.com/1/upload", form, {
          headers: form.getHeaders(),
        });
        fs.unlinkSync(file.path);
        uploadedUrls.push(res2.data.data.url);
      }
      user.gallery = uploadedUrls; // overwrite gallery
    }

    // ✅ Update text fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (county) user.county = county;
    if (label) user.label = label; // store default message
    if (password && password.trim().length > 0) user.password = password.trim();

    await user.save();

    res.json({
      message: "✅ Profile updated successfully!",
      uploadedCount: uploadedUrls.length,
      profilePic: user.profilePic
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Failed to update profile" });
  }
});



  app.get("/", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Startup</title>
      <style>
      body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: black;
      overflow: hidden;
      font-family: 'Arial', sans-serif;
      }
      /* Spinner container */
      .startup {
      position: relative;
      width: 150px;
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      }
      /* Neon spinner */
      .spinner {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 5px solid transparent;
      border-top: 5px solid cyan;
      border-right: 5px solid magenta;
      border-bottom: 5px solid lime;
      border-left: 5px solid orange;
      animation: spin 3s linear infinite, glow 3s ease-in-out infinite alternate;
      box-shadow: 0 0 30px cyan, 0 0 60px magenta, 0 0 90px lime;
      }
      /* Cool gas aura */
      .spinner::after {
      content: "";
      position: absolute;
      inset: -20px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, cyan, magenta, lime, orange, cyan);
      filter: blur(40px);
      opacity: 0.6;
      animation: rotateGas 6s linear infinite;
      }
      /* Hidden text that appears */
      .app-name {
      position: absolute;
      font-size: 3rem;
      font-weight: bold;
      letter-spacing: 3px;
      color: white;
      text-shadow: 0 0 10px cyan, 0 0 20px magenta, 0 0 40px lime;
      opacity: 0;
      transform: scale(0.5);
      transition: opacity 1s ease, transform 1s ease;
      }
      h2{
      position: absolute;
      top: -168%;
      font-size: 1.5rem;
      color: white;
      width: 20rem;
      text-align: center;
      }
      h3{
        position: absolute;
        top: -140%;
        font-size: 0.8rem;
        color: white;
        width: 20rem;
        text-align: center;
        font-style: italic;
      }
      /* Keyframes */
      @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
      }
      @keyframes glow {
      0% { box-shadow: 0 0 20px cyan, 0 0 40px magenta; }
      100% { box-shadow: 0 0 40px lime, 0 0 80px orange; }
      }
      @keyframes rotateGas {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
      }
      /* When active, hide spinner & show text */
      .startup.show-text .spinner {
      opacity: 0;
      transition: opacity 1s ease;
      }
      .startup.show-text .app-name {
      opacity: 1;
      transform: scale(1);
      }
      </style>
      </head>
      <body>
      <div class="startup" id="startup">
      <h2>Moi University</h2>
      <h3>(By Kesir Amani x Rick)</h3>
      <div class="spinner"></div>
      <div class="app-name">Unity</div>
      </div>
      <script>
      // After 4 seconds, show text
      setTimeout(() => {
      document.getElementById("startup").classList.add("show-text");
      setTimeout(()=>{
          window.location.href="/pages/chat.html"
      }, 3000)
      }, 5000);
      </script>
      </body>
      </html>
    `);
  });

  server.listen(process.env.PORT || 3000, ()=>console.log("Backend Started"))