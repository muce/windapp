var Map = function() {
	this.coords = {lat:11, lng:150};
	this.zoom = 12;
	this.options = {
		center: this.coords, 
		zoom: this.zoom
	};
};

Map.prototype.init = function(coords) {
	//alert(coords.latitude+", "+coords.longitude);
	this.coords.lat = coords.latitude;
	this.coords.lng = coords.longitude;
	//alert("Map.init lat:"+this.coords.lat+", lng:"+this.coords.lng);
	this.options.center.lat = this.coords.lat;
	this.options.center.lng = this.coords.lng;
	var map = new google.maps.Map(document.getElementById('map-canvas'), this.options);
};

Map.prototype.update = function(lon, lat, zoom) {
	/*
	this.options = {
		center: {
			lat: lat, 
			lng: lon
		}, 
		zoom: zoom
	};
	*/
	//(map, 'resize');
	//alert("map update");
};
