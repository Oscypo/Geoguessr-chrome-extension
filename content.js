//blink mode geoguessr
let roundTime = 1;
let bufferTime = 2;
let currentlyBlank = false;
let panoramaFound = false;
let resultLayoutFound = false;
//set roundTime in seconds

// function SearchingInterval() {
// 	const interval = setInterval(() => {
// 		console.log("interval ticking");
// 		const panorama = document.querySelector("[data-qa=panorama]");
// 		if (panorama) {
// 			clearInterval(interval);
// 			setTimeout(() => {
// 				blank(panorama);
// 				console.log("wykonane");
// 			}, roundTime * 1000);
// 		}
// 	}, 1);
// }

// if (document.querySelector("[class*=result-layout]")) SearchingInterval();
function blank(panorama) {
	panorama.style.filter = "brightness(0%)";
	console.log("blank");
	return;
}
function blink(panorama) {
	panorama.style.filter = "brightness(100%)";
	console.log("blinked");
	return;
}

const mutation = new MutationObserver((mutationsList, observer) => {
	const panorama = document.querySelector("[data-qa=panorama]");
	const resultLayout = document.querySelector('[class*="result-layout"]');
	if (panorama && !panoramaFound && !resultLayout) {
		resultLayoutFound = false;
		panoramaFound = true;
		console.log("panorama znaleziona");
		blank(panorama);
		setTimeout(() => {
			blink(panorama);
			setTimeout(() => {
				blank(panorama);
			}, roundTime * 1000);
		}, bufferTime * 1000);
	}
	if (!panorama && panoramaFound) {
		console.log("panorama not found, setting panoramaFound to false");
		panoramaFound = false;
	}
	if (resultLayout && !resultLayoutFound) {
		resultLayoutFound = true;
		panoramaFound = false;
		console.log("reuslt layout found");
	}
});
mutation.observe(document.body, { childList: true, subtree: true });
