var GPS = function() {
	this.position = {};
};

GPS.prototype.init = function(callback) {
	//this.div.innerHTML = "LOADING GPS";
	var nav = navigator.geolocation;
    nav.getCurrentPosition(function(position) {
    	callback(position);
    });
};

GPS.prototype.update = function() {
	var nav = navigator.geolocation;
	var self = this;
    nav.getCurrentPosition(function(position) {
    	self.show(position);
    });
};

GPS.prototype.show = function(position) {
	this.print();
};
