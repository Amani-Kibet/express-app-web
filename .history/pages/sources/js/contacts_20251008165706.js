let menuBtn= document.getElementById("menuBtn");
let menuBtnF= document.getElementById("menuBtn");
let menuBtnI= document.getElementById("menuBtn");
let drawer= document.getElementById("drawer");
let drawerF= document.getElementById("drawer");
let drawerI= document.getElementById("drawer");

let isOpen = false;
function openMenu(page) {
  let currentDrawer, currentBtn;

  if(page === 'contacts') {
    currentDrawer = document.getElementById("drawer");
    currentBtn = document.getElementById("menuBtn");
  } else if(page === 'friends') {
    currentDrawer = document.getElementById("drawerF");
    currentBtn = document.getElementById("menuBtnF");
  } else if(page === 'inbox') {
    currentDrawer = document.getElementById("drawerI");
    currentBtn = document.getElementById("menuBtnI");
  }

  if(currentDrawer && currentBtn){
    currentDrawer.classList.toggle("open");
    currentBtn.style.background = currentDrawer.classList.contains("open") ? "cyan" : "none";
  }
}


        userList.addEventListener('scroll', () => {
  const userDivs = document.querySelectorAll('.user');
  const listHeight = userList.clientHeight;
  userDivs.forEach(div => {
    const rect = div.getBoundingClientRect();
    const distanceFromTop = rect.top - userList.getBoundingClientRect().top;
    const distanceFromBottom = listHeight - distanceFromTop;
    let scale = 1;
    if(distanceFromTop < 50) scale = 0.85 + (distanceFromTop/50)*0.15;
    else if(distanceFromBottom < 50) scale = 0.85 + (distanceFromBottom/50)*0.15;
    div.style.transform = `scale(${scale})`;
    div.style.opacity = scale;
  });
});

userList.addEventListener('scroll', () => {
  const userDivs = document.querySelectorAll('.user');
  const listHeight = userList.clientHeight;
  userDivs.forEach(div => {
    const rect = div.getBoundingClientRect();
    const distanceFromTop = rect.top - userList.getBoundingClientRect().top;
    const distanceFromBottom = listHeight - distanceFromTop;
    let scale = 1;
    if(distanceFromTop < 50) scale = 0.85 + (distanceFromTop/50)*0.15;
    else if(distanceFromBottom < 50) scale = 0.85 + (distanceFromBottom/50)*0.15;
    div.style.transform = `scale(${scale})`;
    div.style.opacity = scale;
  });
});