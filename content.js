document.addEventListener("DOMContentLoaded", () => {
	console.log("dom loaded");
});

let panorama = document.querySelector("[data-qa=panorama]");
if (panorama) {
	panorama.style.filter = "brightness(10%)";
} else {
	console.log("pus");
}
