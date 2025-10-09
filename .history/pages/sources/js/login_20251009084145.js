let back= document.getElementById("home");
let loginPage= document.getElementById("loginPage");
let phone1C= document.getElementById("phoneI");
let passC= document.getElementById("passI");
let submit= document.getElementById("submit");
let msg= document.getElementById("msg");
let msgT= document.getElementById("msgT");
let info1={};
let info2={};
let everyone=[];
let searchInput = document.getElementById("searchInput");
let ints=0;
let sounds2= {
  like: new Audio("/sounds/like.mp3")
}
async function fetchAndRenderFriends() {
  if (!info1.phone) return; // make sure user is logged in

  try {
    const res = await fetch("/friends/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone1: info1.phone })
    });

    const data = await res.json();
    const friends = data.friends || [];

    const userListF = document.getElementById("userListF");
    userListF.innerHTML = ""; // clear old list

    // ✅ Display all friends
    friends.forEach(friend => {
      const div = document.createElement("div");
      div.classList.add("user");

      div.innerHTML = `
        <div class="user-pic" style="background-image:url(${friend.piclink})"></div>
        <div class="user-info">
          <h2>${friend.name}</h2>
          <p>${friend.label || ""}</p>
        </div>
      `;

      // Click to open chat
      div.addEventListener("click", () => openChat(friend));
      userListF.appendChild(div);
    });

    // ✅ Update interests count in top section
    const intsEl = document.getElementById("ints");
    if (intsEl) intsEl.innerHTML = `${Math.floor(Math.random()*100)}`;

    // ✅ Update all Interests badges (main + Friends + Inbox pages)
    const badges = [
      document.getElementById("interestsBadge"),
      document.getElementById("interestsBadgeF"),
      document.getElementById("interestsBadgeI")
    ].filter(Boolean); // ignore missing ones

    badges.forEach(badge => {
      if (friends.length > 0) {
        badge.innerText = friends.length;
        badge.style.display = "inline-block";
      } else {
        badge.style.display = "none";
      }
    });

  } catch (err) {
    console.error("❌ Error fetching friends:", err);
  }

  // End of fetchAndRenderFriends()
}


function autoLogin() {
  const savedPhone = localStorage.getItem("phone");
  const savedPass = localStorage.getItem("pass");

  if (savedPhone && savedPass) {
      phone1C.value = savedPhone;
      passC.value = savedPass;

      // Trigger login automatically
      submit.click();
  }
}

window.addEventListener("DOMContentLoaded", autoLogin);

async function obtainEveryone() {
  userList.innerHTML = "";
  await fetch("/path/everyone")
  .then(type=> type.json())
  .then(data=>{
      everyone= data.everyone;
     
  });

  //End of obtainEveryone
}
obtainEveryone()

submit.addEventListener("click", async (event) => {
    event.preventDefault();

    await fetch("/chat/path1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone1: phone1C.value, pass: passC.value })
    })
    .then(type=> type.json())
    .then(data=>{
        info1= data.info1;
    });

    if(info1.name=="Null"){
        phone1C.style.color="red";
        phone1C.type="text";
        phone1C.value+=" Is Not Found...";
        passC.style.color="red";
        passC.type="text";
        passC.value=" Check your details again...";
  
        setTimeout(()=>{
          phone1C.style.color="blue";
          phone1C.type="number";
          passC.style.color="blue";
          passC.type="password";
          passC.value="";
        }, 2000);

        localStorage.removeItem("phone");
        localStorage.removeItem("pass");
    } else {
        localStorage.setItem("phone", phone1C.value);
        localStorage.setItem("pass", passC.value);
        msg.style.display="block";
        msgT.innerHTML=`Welcome Back ${info1.name}!`;
        setTimeout(()=>{
          loginPage.style.display="none";
          msg.style.display="none";
          contactsPage.style.display="block";
        }, 1500);


        contTitle.innerHTML = `💡 ${info1.name}
        <div id="intC">
          <h4 style="font-size:15px;color:yellow">
            ⭐Points: <h5 style="color: red" id="ints">0</h5>
          </h4>
          </div></div>`;
          
        function updateFriends(u, action) {
          fetch("/friends/path1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone1: info1.phone, phone2: u.phone, action: action })
          })
          .then(res => res.json())
          .then(data => {
            userListF.innerHTML = "";
            data.friends.forEach((u) => {
              const div = document.createElement("div");
              div.classList.add("user");
              div.innerHTML = `
              <div class="user-left">
                <div class="user-pic" style="background-image:url(${u.piclink})"></div>
                <div class="user-info">
                  <h2>${u.name}</h2>
                  <p>${u.label}</p>
                </div>
                </div>
              `;
        
              let fr = document.createElement("div");
              fr.classList.add("friendBtn");
              fr.innerHTML = "Remove";
              fr.style.background = "red";
        
              fr.addEventListener("click", (e) => {
                e.stopPropagation();
                if (fr.innerHTML === "Interested") {
                 
                  fr.innerHTML = "Remove";
                  fr.style.background = "red";
                  updateFriends(u, "add");
                } else {
                  fr.innerHTML = "Interested";
                  fr.style.background = "rgb(14,160,14)";
                  updateFriends(u, "remove");
                }
              });
        
              div.addEventListener("click", () => openChat(u));
              div.appendChild(fr);
              userListF.appendChild(div);


              //End of For each Friend
            });
          })
          .catch(err => console.error("❌ Error updating friends:", err));

          //End of updateFriend()
        };


        async function updateUsers(arr) {
          userList.innerHTML = "";
          arr.forEach((u) => {

            fetch("/interest/status",{
              method: "POST",
              headers: {"Content-Type":"application/json"},
              body: JSON.stringify({phone1: info1.phone, phone2: u.phone})
            })
            .then(type=> type.json())
            .then(data=>{

            let div = document.createElement("div");
            div.classList.add("user");
      
            // Friend button
            let fr = document.createElement("div");
            fr.classList.add("friendBtn");
            if(data.status=="null"){
              fr.innerHTML="Interested";
              fr.style.background = "rgb(14,160,14)";
            } else {
              fr.innerHTML="Remove";
              fr.style.background = "red";
            }
            fr.addEventListener("click", (e) => {
              e.stopPropagation();
              if (fr.innerHTML === "Interested") {
                fr.innerHTML = "Remove";
                fr.style.background = "red";
                updateFriends(u, "add");
              } else {
                fr.innerHTML = "Interested";
                fr.style.background = "rgb(14,160,14)";
                updateFriends(u, "remove");
              }
            });
      
            div.innerHTML = `
            <div class="user-pic" style="background-image:url(${u.piclink})"></div>
              <div class="user-info">
                <h2>${u.name}</h2>
                <p>${u.label}</p>
              </div>
            `;
      const picDiv = div.querySelector('.user-pic');
picDiv.addEventListener("click", (e) => {
  e.stopPropagation();
  viewProfile(u);
});


            div.addEventListener("click", () => {
             info2= u;
              openChat(u);
            });
            
            div.appendChild(fr);
            userList.appendChild(div);

            //End of statusData
            });

            //End of .forEach(u)
          });

          //End of updateUsers()
        }
        updateUsers(everyone);


        searchInput.addEventListener("input",()=>{
          let filter = searchInput.value.toLowerCase();
          updateUsers(everyone.filter(u=>u.name.toLowerCase().includes(filter)
        ));
      });
  
        // End of Else User! null
    }

fetchAndRenderFriends();
fetchAndRenderInbox();

//End of Submit Event
});

function updateInboxBadge(inboxData) {
  // find all badge elements across pages
  const badges = [
    document.getElementById("inboxBadge"),   // contacts page
    document.getElementById("inboxBadgeF"),  // friends page
    document.getElementById("inboxBadgeI")   // inbox page
  ].filter(Boolean); // remove null ones

  if (badges.length === 0) return; // no badges found

  // Count unread chats
  const unreadContacts = inboxData.filter(item => item.unreadCount > 0).length;

  // Update all visible badges
  badges.forEach(badge => {
    if (unreadContacts > 0) {
      badge.innerText = unreadContacts;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  });
}


async function fetchAndRenderInbox() {
  if (!info1.phone) return; // ensure user is logged in

  try {
    const res = await fetch("/inbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: info1.phone })
    });

    const data = await res.json();
    let inbox = data.inbox || [];

    // ✅ Sort unread chats to appear on top (like WhatsApp)
    inbox.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return new Date(b.lastTime) - new Date(a.lastTime);
    });

    const inboxContainer = document.getElementById("inboxList");
    inboxContainer.innerHTML = "";

    // ✅ Count how many chats have unread messages (not total messages)
    let unreadChats = 0;

    inbox.forEach(item => {
      if (item.unreadCount > 0) unreadChats++; // ✅ count contact with unread msgs

      // ✅ Bold + green name if unread
      const nameStyle = item.unreadCount > 0
        ? "font-weight:900; color:#25D366;"
        : "font-weight:normal; color:#000;";

      const lastMsgStyle = item.unreadCount > 0
        ? "font-weight:bold; color:#111;"
        : "font-weight:normal; color:#555;";

      const div = document.createElement("div");
      div.classList.add("user");

      div.innerHTML = `
        <div class="user-pic" style="background-image:url(${item.piclink});"></div>
        <div class="inbox-info">
          <div class="inbox-name-time">
            <h3 class="chat-name" style="${nameStyle}">${item.name}</h3>
            <p class="chat-time">${item.lastTime || ""}</p>
          </div>
          <p class="chat-message" style="${lastMsgStyle}">
            ${item.lastMessage || ""}
          </p>
        </div>
        ${
          item.unreadCount > 0
            ? `<div class="unread-badge">${item.unreadCount}</div>`
            : ""
        }
      `;

      // ✅ On click → mark as read + open chat + refresh inbox
      div.addEventListener("click", async () => {
        await fetch("/markAsRead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userPhone: info1.phone,
            senderPhone: item.phone,
          }),
        });

        openChat(item);
        fetchAndRenderInbox(); // refresh badges + inbox instantly
      });

      inboxContainer.appendChild(div);
    });

    // ✅ Update unread chat badges (not total msgs)
    const badges = [
      document.getElementById("inboxBadge"),
      document.getElementById("inboxBadgeF"),
      document.getElementById("inboxBadgeI")
    ].filter(Boolean);

    badges.forEach(badge => {
      if (unreadChats > 0) {
        badge.innerText = unreadChats;
        badge.style.display = "inline-block";
      } else {
        badge.style.display = "none";
      }
    });

  } catch (err) {
    console.error("❌ Error fetching inbox:", err);
  }
}




function openFriends() {
  contactsPage.style.display = "none";
  inboxPage.style.display = "none";
  friendsPage.style.display = "block";
  fetchAndRenderFriends();
};

function openInbox() {
  contactsPage.style.display = "none";
  friendsPage.style.display = "none";
  inboxPage.style.display = "block";
  fetchAndRenderInbox(); // 🔥 fetch messages when inbox opens
}


// Global function for viewing profiles
function viewProfile(u) {
  // Remove previous popup if open
  const existingPopup = document.querySelector('.popupV');
  if (existingPopup) existingPopup.remove();

  // ✅ Make sure gallery exists and has at least 6 slots
  let gallery = u.gallery && u.gallery.length > 0 ? u.gallery : [];
  while (gallery.length < 6) {
    gallery.push("/assets/no-pic.png");
  }

  // Create popup container
  const popup = document.createElement('div');
  popup.className = 'popupV';

  // Create popup content
  const popupContent = document.createElement('div');
  popupContent.className = 'popup-content';

  // Close button
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btnV';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => popup.remove());

  // Carousel container
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'carousel-container';

  // ✅ Add real images first
  gallery.forEach(url => {
    const img = document.createElement('img');
    img.src = url || "/assets/no-pic.png";
    img.className = 'carousel-item';
    carouselContainer.appendChild(img);
  });

  // Info grid
  const infoGrid = document.createElement('div');
  infoGrid.className = 'info-grid';
  const fields = ["Name", "Age", "Gender", "County", "Country", "Phone", "Email", "Hobby"];
  fields.forEach(f => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = f + ": ";
    const p = document.createElement('p');
    p.textContent = u[f.toLowerCase()] || "N/A";
    div.appendChild(span);
    div.appendChild(p);
    infoGrid.appendChild(div);
  });

  // Combine everything
  popupContent.appendChild(closeBtn);
  popupContent.appendChild(carouselContainer);
  popupContent.appendChild(infoGrid);
  popup.appendChild(popupContent);
  document.body.appendChild(popup);

  popup.style.display = 'flex';

  // Smooth carousel scaling
  const items = carouselContainer.querySelectorAll('.carousel-item');
  function updateCarousel() {
    const center = carouselContainer.offsetWidth / 2;
    items.forEach(item => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2 - carouselContainer.scrollLeft;
      const distance = Math.abs(center - itemCenter);
      const scale = Math.max(0.75, 1 - distance / 400);
      item.style.transform = `scale(${scale})`;
      item.style.filter = `brightness(${scale})`;
    });
  }
  carouselContainer.addEventListener('scroll', () => requestAnimationFrame(updateCarousel));
  updateCarousel();

  // Close popup if clicking outside
  popup.addEventListener('click', e => { if (e.target === popup) popup.remove(); });
}

