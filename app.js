
function loadMarkers() {
	// Get Query Parameters
	const urlParams = new URLSearchParams(window.location.search)
	let imageId = urlParams.get("image")
	let modelId = urlParams.get("model")
	let modelType = urlParams.get("type")
	let textAnimeType = urlParams.get("text_anime_type")
	console.log(imageId);
	console.log(modelId);
	console.log(modelType);



	// Upadate tracking image URL
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
}



function loadText(anime_type) {
	const urlParams = new URLSearchParams(window.location.search)

	let modelId = urlParams.get("model")


	const markerDiv = document.createElement("a-text");
	markerDiv.setAttribute("value", modelId);
	markerDiv.setAttribute("scale", "1 1 1");
	markerDiv.setAttribute("color", "red");
	//	markerDiv.setAttribute("opacity", "0 0 0");
	//markerDiv.setAttribute("position", "0 0 0");
	markerDiv.setAttribute("align", "center");
	//markerDiv.setAttribute("align", "center");
	markerDiv.setAttribute("id", "the-text");
	markerDiv.setAttribute("opacity", "1");

	/////flashing///////
	if (anime_type === 'flashing') {
		markerDiv.setAttribute("animation", "property: opacity; to: 0; loop: true; dur: 500")
	}

	var element = document.getElementById("#modelEntity");
	element.appendChild(markerDiv);


	/////// Expansion ///////

	if (anime_type === 'expansion_contraction') {
		anime({
			targets: "#the-text",
			keyframes: [
				{ scale: "1, 1, 1" },
				{ scale: "1.4, 0.8, 1" },
				{ scale: "0.8, 1.4, 1" },
				{ scale: "1.1, 0.8, 1" },
				{ scale: "0.8, 1.4, 1" },
				{ scale: "1, 1, 1" },
			],
			duration: 2000,
			loop: true,
			easing: 'linear'
		})

	}


	////// Vibration //////

	if (anime_type === 'vibration') {
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


}
