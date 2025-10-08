let menuBtn= document.getElementById("menuBtn");
let menuBtnF= document.getElementById("menuBtn");
let menuBtnI= document.getElementById("menuBtn");
let drawer= document.getElementById("drawer");
let drawerF= document.getElementById("drawer");
let drawerI= document.getElementById("drawer");

let isOpen = false;
        function openMenu() {
          drawer.classList.toggle("open");
          drawerF.classList.toggle("open");
          drawerI.classList.toggle("open");
          isOpen = !isOpen;
          menuBtn.style.background = isOpen ? "cyan" : "none";
          menuBtnF.style.background = isOpen ? "cyan" : "none";
          menuBtnI.style.background = isOpen ? "cyan" : "none";
        };

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