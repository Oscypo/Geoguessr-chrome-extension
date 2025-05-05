//blink mode geoguessr
let roundTime = 1.5;
//set roundTime in seconds

const interval = setInterval(() => {
	const panorama = document.querySelector("[data-qa=panorama]");
	if (panorama) {
		clearInterval(interval);
		setTimeout(() => {
			blank(panorama);
			console.log("wykonane");
		}, roundTime * 1000);
	}
}, 1);

function blank(panorama) {
	panorama.style.filter = "brightness(0%)";
	console.log("Panorama found and styled.");
	return;
}
