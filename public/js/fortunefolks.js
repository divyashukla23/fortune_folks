document.addEventListener('scroll',() => {
  var scroll_position = window.scrollY;
  if (scroll_position > 250) {
      header.style.backgroundColor= '#000';
  }
  else{
      header.style.backgroundColor= 'transparent';
  }
});

// Contact section

const inputs = document.querySelectorAll(".input");

function focusFunc(){
    let parent = this.parentNode;
    parent.classList.add("focus");
}
function blurFunc(){
    let parent = this.parentNode;
    if(this.value == ""){
        parent.classList.remove("focus");
    }
}

inputs.forEach((input) => {
    input.addEventListener("focus", focusFunc);
    input.addEventListener("blur", blurFunc);

});
const hamburger=document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu=document.querySelector('.header .nav-bar .nav-list ul');
const header=document.querySelector('.header.container');

hamburger.addEventListener('click',()=>{
    hamburger.classList.toggle('active');
    mobile_menu.classList.toggle('active');
})

