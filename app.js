
window.addEventListener('DOMContentLoaded', (event) => {
	const sceneEl = document.querySelector('a-scene');
	const arSystem = sceneEl.systems["mindar-image-system"];
	const switchCameraButton = document.querySelector("#switch-camera-button");
  
	switchCameraButton.addEventListener('click', () => {
	  arSystem.switchCamera();
	});
});

function loadMarkers() {

	const urlParams = new URLSearchParams(window.location.search)
	let imageId = urlParams.get("image")
	let modelId = urlParams.get("model")
	let modelType = urlParams.get("type")
	let textAnimeType = urlParams.get("text_anime_type")


	let baseUrl = "https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/trensertest/webar-demo/main/track/";
	let imageSample = baseUrl + imageId + ".mind;";
	imageSample = "imageTargetSrc: " + imageSample;
	console.log(imageSample);

	var sceneNode = document.getElementById("#scene");
	sceneNode.setAttribute("mindar-image", imageSample);


	if (modelType == "3d") {
		load3dModles();
	}
	else if (modelType == "2d") {
		loadImages();
	}
	else if (modelType == "text") {
		loadText(textAnimeType)
	}
	else if (modelType == "bgfilter") {
		loadFilter();
		
	}

}

function load3dModles() {
	const urlParams = new URLSearchParams(window.location.search)
	let modelId = urlParams.get("model")

	const markerDiv = document.createElement("a-gltf-model");
	//markerDiv.setAttribute("animation","property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate");
	markerDiv.setAttribute("rotation", "0 0 0");
	markerDiv.setAttribute("position", "0 0 0");

	if (modelId == "1") {
		markerDiv.setAttribute("gltf-model", "models/3D/characterlowpoly2c3.glb");
		markerDiv.setAttribute("scale", "0.5 0.5 0.5");
	} else if (modelId == "2") {
		markerDiv.setAttribute("gltf-model", "models/3D/raccoon/scene.gltf");
		markerDiv.setAttribute("scale", "0.05 0.05 0.05");
	} else if (modelId == "3") {
		markerDiv.setAttribute("gltf-model", "models/3D/trex/scene.gltf");
		markerDiv.setAttribute("scale", "0.025 0.025 0.025");
	} else if (modelId == "4") {
		markerDiv.setAttribute("gltf-model", "models/3D/bear/scene.gltf");
		markerDiv.setAttribute("scale", "0.05 0.05 0.05");
	} else if (modelId == "5") {
		markerDiv.setAttribute("gltf-model", "models/3D/cutecat.glb");
		markerDiv.setAttribute("scale", "0.25 0.25 0.25");
	} else {
		markerDiv.setAttribute("gltf-model", "models/3D/skyscraper.gltf");
		markerDiv.setAttribute("scale", "0.05 0.05 0.05");
	}

	var element = document.getElementById("#modelEntity");
	element.appendChild(markerDiv);
}

function loadImages() {

	const urlParams = new URLSearchParams(window.location.search)
	let modelId = urlParams.get("model")

	const aImage = document.createElement("a-image");
	aImage.setAttribute("id", "#modelEntaImage");
	var element = document.getElementById("#modelEntity");
	element.appendChild(aImage);

	const gifImage = document.getElementById("gifimage");
	const gimImageAsset = document.getElementById("gifImageAsset");
	const markerDiv = document.createElement("a-entity");
	if (modelId == "1") {
		gifImage.setAttribute("src", "models/Image/Osaka.gif");
		gimImageAsset.setAttribute("src", "models/Image/Osaka.gif");
		markerDiv.setAttribute("material", "shader:draw-canvas;src:#gifImageAsset");
	}
	else if (modelId == "3") {
		gifImage.setAttribute("src", "models/Image/butterflies.gif");
		gimImageAsset.setAttribute("src", "models/Image/butterflies.gif");
		markerDiv.setAttribute("material", "shader:draw-canvas;src:#gifImageAsset");
		markerDiv.setAttribute("scale", "1 1 1");
	}
	else if (modelId == "2") {
		gimImageAsset.setAttribute("src", "models/Image/love.png");
		aImage.setAttribute("material", "src:#gifImageAsset");
		markerDiv.setAttribute("scale", "1 1 1");
	}
	else if (modelId == "4") {
		gimImageAsset.setAttribute("src", "models/Image/4.jpg");
		aImage.setAttribute("material", "src:#gifImageAsset");
		markerDiv.setAttribute("scale", "1 1 1");
	} else {
		gimImageAsset.setAttribute("src", "models/Image/5.jpg");
		aImage.setAttribute("material", "src:#gifImageAsset");
		markerDiv.setAttribute("scale", "1 1 1");
	}

	var element = document.getElementById("#modelEntity");
	element.appendChild(markerDiv);

	//console.log("scene rect", document.getElementById('#scene').getBoundingClientRect())
}

function loadText(anime_type) {

	const urlParams = new URLSearchParams(window.location.search)

	let modelId = urlParams.get("model")


	const markerDiv = document.createElement("a-text");
	markerDiv.setAttribute("scale", "0.5 0.5 0.5");
	markerDiv.setAttribute("align", "center");
	markerDiv.setAttribute("id", "the-text");
	markerDiv.setAttribute("opacity", "1");
	markerDiv.setAttribute("color", "red");

	var element = document.getElementById("#modelEntity");
	element.appendChild(markerDiv);

	/////flashing///////
	if (anime_type === 'flashing') {
		markerDiv.setAttribute("value", modelId);
		markerDiv.setAttribute("animation", "property: opacity; to: 0; loop: true; dur: 500")
	}

	/////// Expansion ///////

	if (anime_type === 'expansion_contraction') {
		markerDiv.setAttribute("value", modelId);
		anime({
			targets: "#the-text",
			scale: [
				{ value: "1, 1, 1" },
				{ value: "1.4, 0.8, 1" },
				{ value: "0.8, 1.4, 1" },
				{ value: "1.4, 0.8, 1" },
				{ value: "0.8, 1.4, 1" },

			],
			duration: 3000,
			loop: true,
			easing: 'linear',
			direction: 'alternate',
		})

	}


	////// Vibration //////

	if (anime_type === 'vibration') {
		markerDiv.setAttribute("value", modelId);
		anime({
			targets: "#the-text",
			position: [
				{ value: "0 0 0" },
				{ value: "-0.01 0 0" },
				{ value: "0 0 0" },
				{ value: "0.01 0 0" },
			],
			rotation: [
				{ value: "0 0 0" },
				{ value: "0 0 -1" },
				{ value: "0 0 0" },
				{ value: "0 0 1" },
			],
			duration: 200,
			loop: true,
			easing: 'linear'
		})

	}


	////// typewriter //////
	if (anime_type === 'type_writer') {


		type_write({
			// (C1) REQUIRED
			target: document.getElementById("the-text"),
			text: [modelId],
			// (C2) OPTIONAL
			forward: 500,  // delay between each character, default 100 ms
			backward: 200, // delay between each character, default 50 ms
			pause: 1000,  // pause before next cycle, default 1 sec
			loop: true,   // loop typewriter effect, default true

		});

	}


}

function type_write(instance) {
	// (A) SET DEFAULT OPTIONS

	if (instance.forward === undefined) { instance.forward = 100; }
	if (instance.backward === undefined) { instance.backward = 50; }
	if (instance.pause === undefined) { instance.pause = 1000; }
	if (instance.loop === undefined) { instance.loop = true; }
	if (typeof instance.text != "object") { instance.text = [instance.text]; }

	// (B) PROPERTIES & FLAGS
	instance.current = 0;      // current text
	instance.pointer = 0;      // current character
	instance.direction = true; // true forward, false backward
	instance.draw = true;      // continue to "type text"?

	// (C) TYPEWRITER EFFECT

	instance.typist = () => {
		// (C1) NEXT CHARACTER
		if (instance.direction) {
			instance.pointer++;
			instance.draw = instance.pointer <= instance.text[instance.current].length;
		} else {
			instance.pointer--;
			instance.draw = instance.pointer >= 0;
		}

		// (C2) DRAW HTML
		if (instance.draw) {
			instance.target.setAttribute("value", instance.text[instance.current].substring(0, instance.pointer))
		}

		// (C3) PAUSE & LOOP?
		else {
			// (C3-1) CLEAR TIMER + REVERSE DIRECTION
			clearInterval(instance.timer);
			instance.direction = !instance.direction;

			// (C3-2) NEXT BLOCK OF TEXT
			if (instance.direction) {
				instance.current++;
				if (instance.loop && instance.current == instance.text.length) {
					instance.current = 0;
				}

				if (instance.current <= instance.text.length) {
					instance.timer = setTimeout(() => {
						instance.timer = setInterval(instance.typist, instance.forward);
					}, instance.pause);
				}
			}

			// (C3-3) PAUSE THEN CLEAR TEXT
			else {
				instance.timer = setTimeout(() => {
					instance.timer = setInterval(instance.typist, instance.backward);
				}, instance.pause);
			}
		}
	};

	// (D) START
	instance.timer = setInterval(instance.typist, instance.forward);

	// const exampleTarget = document.getElementById('#modelEntity');

	// exampleTarget.addEventListener("targetLost", event => {
	// 	clearTimeout(instance.timer)
	// })

}

function loadFilter() {
	const urlParams = new URLSearchParams(window.location.search)
	let type = urlParams.get("model")

	if (type == "colorfilter_red") {
		const aImage = document.createElement("a-image");	
		aImage.setAttribute("src","background_filters/colors/AR_ColorFilter_red.gif");
		aImage.setAttribute("height", "7");
		aImage.setAttribute("width", "7");
		aImage.setAttribute("position", "0 0 0");
		var element = document.getElementById("#modelEntity");
		element.appendChild(aImage);
	}
	if (type == "colorfilter_blue") {
		const aImage = document.createElement("a-image");		
		aImage.setAttribute("src","background_filters/colors/AR_ColorFilter_blue.gif");
		aImage.setAttribute("height", "7");
		aImage.setAttribute("width", "7");
		aImage.setAttribute("position", "0 0 0");
		var element = document.getElementById("#modelEntity");
		element.appendChild(aImage);
	}
	if (type == "colorfilter_pale") {
		const aImage = document.createElement("a-image");	
		aImage.setAttribute("src","background_filters/colors/AR_ColorFilter_pale.gif");
		aImage.setAttribute("height", "7");
		aImage.setAttribute("width", "7");
		aImage.setAttribute("position", "0 0 0");
		var element = document.getElementById("#modelEntity");
		element.appendChild(aImage);
	}
	if (type == "colorfilter_yellow") {
		const aImage = document.createElement("a-image");		
		aImage.setAttribute("src","background_filters/colors/AR_ColorFilter_yellow.gif");
		aImage.setAttribute("height", "7");
		aImage.setAttribute("width", "7");
		aImage.setAttribute("position", "0 0 0");
		var element = document.getElementById("#modelEntity");
		element.appendChild(aImage);
	}
}

