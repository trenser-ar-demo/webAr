document.addEventListener("DOMContentLoaded", function () {

	const recordButton = document.querySelector("#record-button");
	const sceneEl = document.querySelector('a-scene');

	const capture = (renderer, scene, camera) => {

		//const video = document.querySelector('video')
		const video = document.getElementsByTagName('video')[1]
		const renderCanvas = renderer.domElement;

		// output canvas
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.width = renderCanvas.width;
		canvas.height = renderCanvas.height;

		const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
		const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.clientHeight;
		const sw = video.videoWidth - sx * 2;
		const sh = video.videoHeight - sy * 2;

		context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

		renderer.preserveDrawingBuffer = true;
		renderer.render(scene, camera); // empty if not run
		context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
		renderer.preserveDrawingBuffer = false;

		const data = canvas.toDataURL('image/png');
		return data;

		// const link = document.createElement('a');
		// link.download = 'ar_screnshot.png';
		// link.href = data;
		// link.click();
	}

	// captureButton.addEventListener('click', () => {
	// 	const renderer = sceneEl.renderer;
	// 	const camera = sceneEl.camera;
	// 	const scene = sceneEl.sceneEl.object3D;

	// 	capture(renderer, scene, camera);
	// });

	const previewImage = document.querySelector("#preview-image");
	const previewVideo = document.querySelector("#preview-video");
	const CancelpreviewVideo = document.querySelector("#cancel_video_preview");
	const SharePreviewVideo = document.querySelector("#share_video");
	const previewVideoDiv = document.querySelector("#video-share");
	const previewClose = document.querySelector("#preview-close");
	const preview = document.querySelector("#preview");
	const previewShare = document.querySelector("#preview-share");

	document.querySelector("#capture").addEventListener("click", () => {

		const renderer = sceneEl.renderer;
		const camera = sceneEl.camera;
		const scene = sceneEl.sceneEl.object3D;

		const data = capture(renderer, scene, camera);
		preview.style.visibility = "visible";
		previewImage.src = data;
	});

	previewClose.addEventListener("click", () => {
		preview.style.visibility = "hidden";
	});

	previewShare.addEventListener("click", () => {
		const canvas = document.createElement('canvas');
		canvas.width = previewImage.width;
		canvas.height = previewImage.height;
		const context = canvas.getContext('2d');
		context.drawImage(previewImage, 0, 0, canvas.width, canvas.height);

		canvas.toBlob((blob) => {
			const file = new File([blob], "photo.png", { type: "image/png" });
			const files = [file];
			if (navigator.canShare && navigator.canShare({ files })) {
				navigator.share({
					files: files,
					title: 'AR Photo',
				})
			} else {
				const link = document.createElement('a');
				link.download = 'photo.png';
				link.href = previewImage.src;
				link.click();
			}
		});
	});

	const VideoCapture = (renderer, scene, camera) => {
		recordButton.disabled = true;
		recordButton.innerHTML = "Recording.."
		//	const video = document.querySelector('video')
		const video = document.getElementsByTagName('video')[1]
		const renderCanvas = renderer.domElement;

		// output canvas
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.width = renderCanvas.width;
		canvas.height = renderCanvas.height;

		const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
		const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.clientHeight;
		const sw = video.videoWidth - sx * 2;
		const sh = video.videoHeight - sy * 2;

		renderer.preserveDrawingBuffer = true;
		const canvasDrwaingLoop = setInterval(function () {
			context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
			renderer.render(scene, camera); // empty if not run
			context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
		}, 100);



		var videoStream = canvas.captureStream(30);
		var mediaRecorder = new MediaRecorder(videoStream);

		var chunks = [];
		mediaRecorder.ondataavailable = function (e) {
			chunks.push(e.data);
		};

		mediaRecorder.onstop = function (e) {
			var blob = new Blob(chunks, { 'type': 'video/mp4' });
			chunks = [];
			var videoURL = URL.createObjectURL(blob);

			previewVideoDiv.style.visibility = "visible";
			previewVideo.src = videoURL;
			previewVideo.play()

			SharePreviewVideo.addEventListener("click", () => {
				const file = new File([blob], "AR_video.mp4", { type: "video/mp4" })
				const files = [file];
				if (navigator.canShare && navigator.canShare({ files })) {
					navigator.share({
						files: files,
						title: 'AR Video',
					})
				} else {
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					a.href = videoURL;
					a.download = "fileas";
					a.click();
					window.URL.revokeObjectURL(url);
				}
			})

			//previewVideo.loop = true
			// var a = document.createElement("a");
			// document.body.appendChild(a);	
			// a.style = "display: none";
			// a.href = videoURL;
			// a.download = "fileas";
			// a.click();
			// window.URL.revokeObjectURL(url);
		};
		mediaRecorder.ondataavailable = function (e) {
			chunks.push(e.data);
		};

		mediaRecorder.start();
		setTimeout(function () {
			mediaRecorder.stop();
			renderer.preserveDrawingBuffer = false;
			clearInterval(canvasDrwaingLoop)
			recordButton.disabled = false;
			recordButton.innerHTML = "Video"
		}, 5000);

	}
	recordButton.addEventListener("click", () => {
		const renderer = sceneEl.renderer;
		const camera = sceneEl.camera;
		const scene = sceneEl.sceneEl.object3D;

		VideoCapture(renderer, scene, camera);

	});

	CancelpreviewVideo.addEventListener('click', () => {
		previewVideoDiv.style.visibility = 'hidden'
	})

})



function loadMarkers() {

	const urlParams = new URLSearchParams(window.location.search)
	let imageId = urlParams.get("image")
	let modelId = urlParams.get("model")
	let modelType = urlParams.get("type")
	let textAnimeType = urlParams.get("text_anime_type")


	// const exampleTarget = document.getElementById('#modelEntity');

	// exampleTarget.addEventListener("targetFound", event => {
	// 	console.log("target located")
	// });


	// Upadate tracking image URL
	let baseUrl = "https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/trensertest/webar-demo/main/track/";
	let imageSample = baseUrl + imageId + ".mind;";
	imageSample = "imageTargetSrc: " + imageSample;
	console.log(imageSample);

	var sceneNode = document.getElementById("#scene");
	sceneNode.setAttribute("mindar-image", imageSample);

	// const exampleTarget = document.getElementById('#modelEntity');
	// exampleTarget.addEventListener("targetFound", event => {

	// 	if (modelType == "3d") {
	// 		load3dModles();
	// 	}
	// 	else if (modelType == "2d") {
	// 		loadImages();
	// 	}
	// 	else if (modelType == "text") {
	// 		loadText(textAnimeType)
	// 	}
	// })

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
				{ value: "0.5, 0.5, 0.5" },
				{ value: "0.7, 0.2, 0.2" },
				{ value: "0.2, 0.8, 0.5" },
				{ value: "0.7, 0.4, 0.5" },
				{ value: "0.4, 0.7, 0.5" },

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

	////// color //////
	if (anime_type === 'color_gradient') {
		markerDiv.setAttribute("value", modelId);
		markerDiv.setAttribute("animation", "property: color; from:#BA00FF; to: #FF006C; loop: true; dur: 2000;  dir: alternate;")
	}

	////// typewriter //////
	if (anime_type === 'type_writer') {

		//const exampleTarget = document.getElementById('#modelEntity');
		// exampleTarget.addEventListener("targetFound", event => {	
		// })

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
			//	instance.target.innerHTML = instance.text[instance.current].substring(0, instance.pointer);
			//console.log("currently typed", instance.text[instance.current].substring(0, instance.pointer))
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


