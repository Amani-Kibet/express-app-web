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

async function fetchAndRenderFriends() {
  if(!info1.phone) return; // make sure user is logged in
    try {
        const res = await fetch("/friends/list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone1: info1.phone })
        });

        const data = await res.json();
        const friends = data.friends || [];

        userListF.innerHTML = ""; // clear old list

        friends.forEach(friend => {
            const div = document.createElement("div");
            div.classList.add("user");

            div.innerHTML = `
                <div class="user-pic" style="background-image:url('/pictures/${friend.piclink}')"></div>
                <div class="user-info">
                    <h2>${friend.name}</h2>
                    <p>${friend.label || ""}</p>
                </div>
            `;

            // Optional: click to open chat
            div.addEventListener("click", () => openChat(friend));

            userListF.appendChild(div);
        });

        const intsEl = document.getElementById("ints");
  if(intsEl) intsEl.textContent = friends.length;
    } catch (err) {
        console.error("Error fetching friends:", err);
    }

    //End of fetchAndRenderFriend
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


        contTitle.innerHTML = `${info1.name}
        <div id="intC">
          <h4 style="font-size:15px;color:yellow">
            Interests: <h5 style="color: red" id="ints">0</h5>
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
                <div class="user-pic" style="background-image:url('/pictures/${u.piclink}')"></div>
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
              <div class="user-pic" style="background-image:url('/pictures/${u.piclink}')"></div>
              <div class="user-info">
                <h2>${u.name}</h2>
                <p>${u.label}</p>
              </div>
            `;
      
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

      document.getElementById("openFriends").addEventListener("click", () => {
        contactsPage.style.display = "none";
        friendsPage.style.display = "block";
        fetchAndRenderFriends();
    });
  
        // End of Else User! null
    }

fetchAndRenderFriends();

//End of Submit Event
});


