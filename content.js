//blink mode geoguessr
let roundTime = {
	get: () => {
		return parseFloat(localStorage.getItem("roundTime")) || 0.5;
	},
};
let bufferTime = 2;
let currentlyBlank = false;
let panoramaFound = false;
let resultLayoutFound = false;

function injectMenu(place) {
	// Create outer container (main box)
	const outerContainer = document.createElement("div");
	outerContainer.id = "blink-settings";
	outerContainer.style.width = "100%";
	outerContainer.style.maxHeight = "400px";
	outerContainer.style.background = "rgb(0, 0, 0, 0.2)";
	outerContainer.style.borderRadius = "12px";
	outerContainer.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.15)";
	outerContainer.style.margin = "20px 0";
	outerContainer.style.fontFamily = "Arial, sans-serif";
	outerContainer.style.color = "white";
	outerContainer.style.display = "flex";
	outerContainer.style.justifyContent = "center";
	outerContainer.style.alignItems = "center";
	outerContainer.style.padding = "20px";
	outerContainer.style.boxSizing = "border-box";

	// Inner container with two side-by-side sections
	const innerContainer = document.createElement("div");
	innerContainer.style.display = "flex";
	innerContainer.style.width = "100%";
	innerContainer.style.maxWidth = "800px";
	innerContainer.style.gap = "40px";
	innerContainer.style.boxSizing = "border-box";
	// Shared section style
	const createSection = (titleText, inputs = []) => {
		const section = document.createElement("div");
		section.style.flex = "1";
		section.style.display = "flex";
		section.style.flexDirection = "column";
		section.style.alignItems = "stretch";

		const heading = document.createElement("h3");
		heading.textContent = titleText;
		heading.style.margin = "0 0 20px 0";
		heading.style.textAlign = "center";

		section.appendChild(heading);

		inputs.forEach(({ labelText, inputElement }) => {
			const wrapper = document.createElement("label");
			wrapper.style.display = "flex";
			wrapper.style.justifyContent = "space-between";
			wrapper.style.alignItems = "center";
			wrapper.style.marginBottom = "15px";

			const labelSpan = document.createElement("span");
			labelSpan.textContent = labelText;

			wrapper.appendChild(labelSpan);
			wrapper.appendChild(inputElement);
			section.appendChild(wrapper);
		});

		return section;
	};

	// Inputs for blink section
	const blinkInput = document.createElement("input");
	blinkInput.type = "checkbox";
	blinkInput.id = "blinkMode";

	const roundInput = document.createElement("input");
	roundInput.type = "number";
	roundInput.id = "roundTime";
	roundInput.value = "0.5";
	roundInput.min = "0.1";
	roundInput.style.width = "60px";

	const leftBox = createSection("Blink Settings", [
		{ labelText: "Blink Mode", inputElement: blinkInput },
		{ labelText: "Round Time (sec)", inputElement: roundInput },
	]);

	// Input for streak section
	const streakInput = document.createElement("input");
	streakInput.type = "checkbox";
	streakInput.id = "streakCounter";

	const rightBox = createSection("Country Streak", [
		{ labelText: "Enable Streak", inputElement: streakInput },
	]);

	// Append both sections to the inner container
	innerContainer.appendChild(leftBox);
	innerContainer.appendChild(rightBox);

	// Append inner container to outer container
	outerContainer.appendChild(innerContainer);

	// Finally, append to your target element
	place.appendChild(outerContainer);
}

function blank(panorama) {
	panorama.style.filter = "brightness(0%)";
	console.log("blank");
}
function blink(panorama) {
	panorama.style.filter = "brightness(100%)";
	console.log("blinked");
}
function blinkModeFunctionality() {
	const panorama = document.querySelector("[data-qa=panorama]");
	const resultLayout = document.querySelector('[class*="result-layout"]');
	if (panorama && !panoramaFound && !resultLayout) {
		resultLayoutFound = false;
		panoramaFound = true;
		console.log("panorama znaleziona");
		blank(panorama);
		setTimeout(() => {
			console.log(`blinked for ${roundTime.get()} seconds`);
			blink(panorama);
			setTimeout(() => {
				blank(panorama);
			}, roundTime.get() * 1000);
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
}
function UIfunctionality() {
	let blockRoot = document.querySelector('[class*="map-block_root"]');
	if (blockRoot && !document.querySelector("#blink-settings")) {
		injectMenu(blockRoot);
	}
	if (document.querySelector("#blink-settings")) {
		// Retrieve state of blinkMode from localStorage
		const blinkMode = localStorage.getItem("blinkMode");
		if (blinkMode == "true") {
			document.querySelector("#blinkMode").checked = true;
		} else if (blinkMode == "false") {
			document.querySelector("#blinkMode").checked = false;
		}

		// Retrieve state of roundTime from localStorage
		const roundTimeValue = localStorage.getItem("roundTime");
		if (roundTimeValue) {
			document.querySelector("#roundTime").value = roundTimeValue;
		}

		document.querySelector("#roundTime").addEventListener("input", () => {
			localStorage.setItem(
				"roundTime",
				document.querySelector("#roundTime").value
			);
		});
		document.querySelector("#blinkMode").addEventListener("change", () => {
			if (document.querySelector("#blinkMode").checked) {
				localStorage.setItem("blinkMode", "true");
			} else {
				localStorage.setItem("blinkMode", "false");
			}
		});
	}
}

const mutation = new MutationObserver((mutationsList, observer) => {
	localStorage.getItem("blinkMode") == "true" ? blinkModeFunctionality() : "";
	UIfunctionality();
});
mutation.observe(document.body, { childList: true, subtree: true });
