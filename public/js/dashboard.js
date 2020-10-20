// const hamburger = document.querySelector(".header .nav-bar .nav-list .hamburger");
// const mobile_menu = document.querySelector(".header .nav-bar .nav-list ul");
// const header = document.querySelector(".header.container");

const profile = document.querySelector(".profile");
const donations = document.querySelector(".donations");
const requests = document.querySelector(".requests");

const profileBtn = document.getElementById("profile-btn");
const donationBtn = document.getElementById("donation-btn");
const requestBtn = document.getElementById("request-btn");

// hamburger.addEventListener("click", () => {
// 	hamburger.classList.toggle("active");
// 	mobile_menu.classList.toggle("active");
// });

// document.addEventListener("scroll", () => {
// 	var scroll_position = window.scrollY;
// 	if (scroll_position > 250) {
// 		header.style.backgroundColor = "#000";
// 	} else {
// 		header.style.backgroundColor = "transparent";
// 	}
// });

profileBtn.addEventListener("click", () => {
	donations.style.display = "none";
	requests.style.display = "none";
	profile.style.display = "block";
});

donationBtn.addEventListener("click", () => {
	donations.style.display = "block";
	requests.style.display = "none";
	profile.style.display = "none";
});

requestBtn.addEventListener("click", () => {
	donations.style.display = "none";
	requests.style.display = "block";
	profile.style.display = "none";
});
