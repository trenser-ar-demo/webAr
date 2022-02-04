function loadMarkers(){
	// Get Query Parameters
	const urlParams = new URLSearchParams(window.location.search)
	let imageId = urlParams.get("image")
	let modelId = urlParams.get("model")
	let modelType= urlParams.get("type")
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
	
	if( modelType == "3d"){
		load3dModles();
	}
	else if( modelType == "2d"){
		loadImages();
	}
	else if( modelType == "text")
	{
		loadText()
	}


		
	//https://carnaux.github.io/NFT-Marker-Creator/
	//https://console.echo3d.co/#/pages/contentmanager
}

function load3dModles(){
	const urlParams = new URLSearchParams(window.location.search)
	let modelId = urlParams.get("model")
	
	const markerDiv = document.createElement("a-gltf-model");
	const arModelDiv = document.createElement("a-asset-item");
	arModelDiv.setAttribute("id", "#arModel");
	
	//markerDiv.setAttribute("animation","property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate");
	markerDiv.setAttribute("rotation", "0 0 0" );
	markerDiv.setAttribute("position", "0 0 0" );
	if( modelId == "1"){
		markerDiv.setAttribute("gltf-model", "models/3D/bear/scene.gltf");
		markerDiv.setAttribute("scale", "0.05 0.05 0.05");
	}
	else if( modelId == "2"){
		markerDiv.setAttribute("gltf-model", "models/3D/raccoon/scene.gltf");
		markerDiv.setAttribute("scale", "0.05 0.05 0.05");	
	}
	else if( modelId == "3"){
		markerDiv.setAttribute("gltf-model", "models/3D/sphere.glb");
		markerDiv.setAttribute("scale", "0.75 0.75 0.75");	
		markerDiv.setAttribute("animation-mixer","");
	}
	else if (modelId == "4"){
		markerDiv.setAttribute("gltf-model", "models/3D/skyscraper.gltf");
		markerDiv.setAttribute("scale", "0.05 0.05 0.05");
	}else{
		markerDiv.setAttribute("gltf-model", "models/3D/cutecat.glb");
		markerDiv.setAttribute("scale", "0.25 0.25 0.25");		
	}
	var element = document.getElementById("#modelEntity");
	element.appendChild(markerDiv);
}

function loadImages(){
	const urlParams = new URLSearchParams(window.location.search)
	let modelId = urlParams.get("model")
	const markerDiv = document.createElement("a-image");
	markerDiv.setAttribute("rotation", "0 0 0" );
	markerDiv.setAttribute("position", "0 0 0" );
	if( modelId == "1"){
		markerDiv.setAttribute("src", "models/Image/butterflies.gif");
		markerDiv.setAttribute("scale", "1 1 1");
	}
	else if( modelId == "2"){
		markerDiv.setAttribute("src", "models/Image/Osaka.gif");
		markerDiv.setAttribute("scale", "1 1 1");
	}
	else{
		markerDiv.setAttribute("src", "models/Image/love.png");
		markerDiv.setAttribute("scale", "1 1 1");
	}
	var element = document.getElementById("#modelEntity");
	element.appendChild(markerDiv);	
}


function loadText(){
	const urlParams = new URLSearchParams(window.location.search)
	let modelId = urlParams.get("model")
	const markerDiv = document.createElement("a-text");
	markerDiv.setAttribute("value", modelId);
	markerDiv.setAttribute("scale", "1 1 1");
	markerDiv.setAttribute("color", "black");
	markerDiv.setAttribute("rotation", "0 0 0" );
	markerDiv.setAttribute("position", "0 0 0" );
	var element = document.getElementById("#modelEntity");
	element.appendChild(markerDiv);	
}

