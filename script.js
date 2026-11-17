const userName =
localStorage.getItem("userName");

if(userName){

document.getElementById(
"welcome-user"
).innerText =
"Welcome, " + userName + " 👋";

}
function openCart(){

document.getElementById(
"cart-sidebar"
).classList.add("active");

}

function closeCart(){

document.getElementById(
"cart-sidebar"
).classList.remove("active");

}
window.addEventListener("scroll", function(){

let reveals =
document.querySelectorAll(".reveal");

reveals.forEach(function(item){

let windowHeight =
window.innerHeight;

let revealTop =
item.getBoundingClientRect().top;

if(revealTop < windowHeight - 100){

item.classList.add("active");

}

});

});
window.dispatchEvent(
new Event("scroll")
);
function reveal(){

let reveals =
document.querySelectorAll(".reveal");

reveals.forEach(item=>{

let top =
item.getBoundingClientRect().top;

let height =
window.innerHeight;

if(top < height - 100){

item.classList.add("active");

}

});

}

window.addEventListener(
"scroll",
reveal
);

reveal();