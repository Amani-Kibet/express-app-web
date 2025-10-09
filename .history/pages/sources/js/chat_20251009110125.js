let text= message.value.trim();
let sendbt= document.getElementById("sendbtn");
let messageBox= document.getElementById("message");
let chat= document.getElementById("chat");

let page = io();
let popup = document.getElementById("popup");
let timeout;
let inboxPage= document.getElementById("inboxPage");

const gifPopup = document.getElementById("gifPopup");
const gifBtn = document.getElementById("gifBtn");

// Some animated HTML "GIFs"
const htmlGifs = [
  `<div style="font-size:18px; color:#00ffcc; animation: pulse 1s infinite;">👋 Hello!</div>`,
  `<div style="font-size:18px; color:#ff6b6b; animation: bounce 1s infinite;">🎉 Welcome!</div>`,
  `<div style="font-size:18px; color:#ffd700; animation: wave 1.5s infinite;">👋 Goodbye!</div>`,
  `<div style="font-size:18px; color:#a855f7; animation: spin 1s infinite;">💫 Wow!</div>`,
  `<div style="font-size:18px; color:#00d084; animation: pulse 1.2s infinite;">🙏 Thanks!</div>`,
  `<div style="font-size:18px; color:#ff9f43; animation: bounce 1.3s infinite;">🔥 Nice!</div>`,
  `<div style="font-size:18px; color:#3b82f6; animation: wave 2s infinite;">💙 Cool!</div>`,
  `<div style="font-size:18px; color:#e11d48; animation: spin 1.5s infinite;">❤️ Love it!</div>`,
  `<div style="font-size:18px; color:#10b981; animation: bounce 1.2s infinite;">😎 Awesome!</div>`,
  `<div style="font-size:18px; color:#6366f1; animation: pulse 1.1s infinite;">👑 Respect!</div>`
];

gifBtn.addEventListener("click", () => {
  gifPopup.style.display = gifPopup.style.display === "block" ? "none" : "block";
  if (gifPopup.innerHTML === "") {
    htmlGifs.forEach(html => {
      const div = document.createElement("div");
      div.innerHTML = html;
      div.style.cursor = "pointer";
      div.style.marginBottom = "12px";
      div.addEventListener("click", () => {
        sendGif(html); // send as message
        gifPopup.style.display = "none";
      });
      gifPopup.appendChild(div);
    });
  }
});

function sendGif(html) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble chat-right";
  bubble.innerHTML = html;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;

  page.emit("message", { 
    from: info1.phone, 
    to: info2.phone, 
    text: html, 
    fromName: info2.name 
  });
}


async function openChat(info2) {
  let contactsPage = document.getElementById("contactsPage");
  chatPage.style.display = "block";
  contactsPage.style.display = "none";
  friendsPage.style.display = "none";
  inboxPage.style.display = "none";

  pic.style.background = `url(${info2.piclink})`;
  pic.style.backgroundSize = "cover";
  nameinfo.innerHTML = info2.name;
  phoneinfo.innerHTML = info2.phone;

  console.log("Opening chat with:", info2.phone);

  // ✅ Step 1: Mark messages as read (via backend)
  await fetch("/markAsRead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userPhone: info1.phone,  // logged-in user
      senderPhone: info2.phone // person you're chatting with
    }),
  })
  .then(res => res.json())
  .then(data => console.log("Marked as read ✅", data))
  .catch(err => console.error("Error marking as read:", err));

  // ✅ Step 2: Fetch chat messages
  fetch("/chat/path4", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone1: info1.phone, phone2: info2.phone }),
  })
    .then(res => res.json())
    .then(data => {
      chat.innerHTML = "";

      let received = data.msgReceivedD;
      let sent = data.msgSentD;

      let i = 0, j = 0;
      let allMsgs = [];

      // Alternate manually but START with sent
      while (i < received.length || j < sent.length) {
        if (j < sent.length) {
          allMsgs.push({ ...sent[j], type: "sent" });
          j++;
        }
        if (i < received.length) {
          allMsgs.push({ ...received[i], type: "received" });
          i++;
        }
      }

      // Flash messages one by one
      let k = 0;
      function showNext() {
        if (k < allMsgs.length) {
          let msg = allMsgs[k];
          let bubble = document.createElement("div");

          if (msg.type === "sent") {
            bubble.className = "chat-bubble chat-right";
            bubble.innerHTML = `${msg.message} (${msg.time})`;
          } else {
            bubble.className = "chat-bubble chat-left";
            bubble.innerHTML = `${msg.message} (${msg.time})`;
          }

          chat.appendChild(bubble);
          chat.scrollTop = chat.scrollHeight;

          k++;
          setTimeout(showNext, 20); // adjust speed
        }
      }
      showNext();

      // ✅ Step 3: Refresh inbox unread count
      fetchAndRenderInbox();
    });
}


  async function loadInbox() {
    const phone = info1.phone;
    const res = await fetch("/inbox", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    const inboxDiv = document.getElementById("inbox");
    inboxDiv.innerHTML = "";
  
    data.inbox.forEach(chat => {
      const div = document.createElement("div");
      div.className = "chat-item";
      div.innerHTML = `
        <div class="chat-pic" style="background-image:url(${chat.piclink})"></div>
        <div class="chat-info">
          <h3>${chat.name}</h3>
          <p>${chat.lastMessage}</p>
        </div>
        ${chat.unreadCount > 0 ? `<div class="unread-badge">${chat.unreadCount}</div>` : ""}
      `;
  
      div.addEventListener("click", () => openChat(chat));
      inboxDiv.appendChild(div);
    });
  }
  
  loadInbox();
  

  function typeMessage(text, container) {
    container.style.whiteSpace = "pre-wrap";
    container.innerHTML = ""; // clear previous
    let i = 0;
    let current = "";
    let insideTag = false;
  
    const interval = setInterval(() => {
      const char = text[i];
      current += char;
  
      if (char === "<") insideTag = true;
      if (char === ">") insideTag = false;
  
      // When not inside an HTML tag, update the display
      if (!insideTag || char === ">") {
        container.innerHTML = current;
      }
  
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        container.innerHTML = text; // make sure full HTML rendered
      }
    }, 30); // you can change speed here
  }
  

  function send(){
    new Audio("/sounds/send.mp3").play()
    const input = document.getElementById("message");
    const text = input.value;
    if (text === "") return;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble chat-right";
    typeMessage(text, bubble);           // use textContent, not innerText
    bubble.style.whiteSpace = "pre-wrap";
    
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
    input.value = "";

    page.emit("message", {from: info1.phone, to: info2.phone, text: text, fromName: info2.name});

    //End of Send()
  };

  sendbt.addEventListener("click", send);
      messageBox.addEventListener("keydown", function(event) {
        if(event.key === "Enter") {
            event.preventDefault(); // prevent line break if textarea
            send();
        }
    });

  page.on("serverReply", data => {
  
    if (data.to == info1.phone && data.from==info2.phone) {

      const typing = document.createElement("div");
            typing.className = "typing-indicator";
            chat.appendChild(typing);
            chat.scrollTop = chat.scrollHeight;
      
            setTimeout(() => {
              new Audio("/sounds/receive.mp3").play()
              typing.remove();
  
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble chat-left";
      bubble.style.whiteSpace = "pre-wrap";
      chat.appendChild(bubble);
      typeMessage(data.text, bubble);
      chat.scrollTop = chat.scrollHeight;
    
    }, 4000);

      //End of If Then
    }

    //End of page.on Data (Receive Message)
  });

  settings.addEventListener("click", ()=>{
    setTimeout(()=>{
      dropdown.style.display="none"
    }, 6000);

     dropdown.style.display = dropdown.style.display==="flex"?"none":"flex";
    });

      function toggleDarkMode() {
        document.body.classList.toggle("dark");
      }
      function openModal() {
        document.getElementById("modal").style.display="flex";
        document.getElementById("dropdown").style.display="none";
      }
      function closeModal() {
        document.getElementById("modal").style.display="none";
      }
      function changeBackgroundColor(color) { chat.style.background=color;

      }
      function uploadBackground(event) {
        const file = event.target.files[0];
        if(file){
          const reader = new FileReader();
          reader.onload = function(e){
            chat.style.background = `url(${e.target.result}) no-repeat center/cover`;
            chat.style.backgroundSize = "cover";
          }
          reader.readAsDataURL(file);
        }

        //End of uploadBackground()
      }

      function exit(){
        chatPage.style.display="none";
        contactsPage.style.display="block";
        dropdown.style.display="none"
      }


// Online/Offline Popup
      
function showPopup(status) {
clearTimeout(timeout);
popup.className = `popup ${status}`;
popup.textContent =
status === "online"
? "✅ You’re Back Online!"
: "🚫 You’ve Gone Offline!";

if (status === "online") {
popup.style.setProperty("--glow", "#22c55e");
popup.style.setProperty("--rgb", "34,197,94");
} else {
popup.style.setProperty("--glow", "#ef4444");
popup.style.setProperty("--rgb", "239,68,68");
}
popup.classList.add("show");

timeout = setTimeout(() => {
popup.classList.remove("show");
popup.classList.add("hide");
setTimeout(() => popup.classList.remove("hide"), 500);
}, 6000);
}

window.addEventListener("online", () => {showPopup("online"); console.log("online")});
window.addEventListener("offline", () => {showPopup("offline"); console.log("offline")});

window.addEventListener("load", () => {
if (!navigator.onLine) showPopup("offline");
});

// End Of Online/Offline Popup

function logout() {
  
  localStorage.removeItem("phone");
  localStorage.removeItem("pass");

  document.getElementById("contactsPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
  msg.style.display="none";
  document.getElementById("phoneI").value = "";
  document.getElementById("passI").value = "";
}
