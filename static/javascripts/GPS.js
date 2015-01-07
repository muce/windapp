var GPS = function(div, app) {
	this.div = div;
	this.app = app;
	this.coords = {};
	this.iteration = 0;
	this.callback = null;
};

GPS.prototype.init = function(callback) {
	//this.div.innerHTML = "LOADING GPS";
	this.callback = callback;
	var nav = navigator.geolocation;
	var self = this;
    nav.getCurrentPosition(function(coords) {
    	self.loaded(coords);
    });
};

GPS.prototype.loaded = function(coords) {
	this.callback(coords, this.app);
};

GPS.prototype.update = function() {
	var nav = navigator.geolocation;
	var self = this;
    nav.getCurrentPosition(function(coords) {
    	self.show(coords);
    });
};

GPS.prototype.show = function(position) {
	this.coords["lng"] = position.coords.longitude.toFixed(2);
	this.coords["lat"] = position.coords.latitude.toFixed(2);
	this.iteration++;
	//this.print();
};

GPS.prototype.getCoords = function() {
	return this.coords;
};

GPS.prototype.print = function() {
	var br = "<br/>";
	var nb = "&nbsp;"+"&nbsp;";
	var out = "GPS COORDS"+br;
	out += "ITERATION: "+this.iteration+br;
	out += nb+"Longitude: "+this.coords.lng+br;
	out += nb+"Latitude: "+this.coords.lat;
	this.div.innerHTML = out;
};
