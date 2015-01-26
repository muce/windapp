var Map = function(div) {
	this.TEST_COORDS = {
		"london": [ -0.13, 51.51 ], 
		"margate": [ 1.38617, 51.381321 ], 
		"saint-malo": [ -2.01667, 48.650002 ]
	};
	this.div = div;
	this.size = null;
	this.coords = {lng:this.TEST_COORDS["london"][0], lat:this.TEST_COORDS["london"][1]};
	this.zoom = 16;
	this.options = {
		center: this.coords, 
		zoom: this.zoom
	};
};

Map.prototype.init = function(coords, size) {
	this.div.style.width = size.width+"px";
	this.div.style.height = size.height+"px";
	this.coords.lat = coords.latitude;
	this.coords.lng = coords.longitude;
	//this.coords.lat = this.coords.lat;
	//this.coords.lng = this.coords.lng;
	
	var map = new google.maps.Map(this.div, this.options);
	
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
