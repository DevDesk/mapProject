function mapInit(lat,lng) {
	var mapOptions = {
		center: { lat: lat, lng: lng},
		zoom: 7
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
	var trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(map);
	return map;
}

function mapAddMarker(map,lat,lng,title){
	var marker = new google.maps.Marker({
		position: { lat: lat, lng: lng},
		map: map,
		title: title
	});
}

// google.maps.event.addDomListener(window, 'load', initialize);


// var map = mapInit(47.6201451, -122.3298646);
// mapAddMarker(map, 47.6201451, -122.3298646,"this is my title");