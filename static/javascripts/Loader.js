function Loader(callback) {
	this.callback = callback;
};

Loader.prototype.load = function(url, type) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
    request.responseType = type;
    request.callback = this.callback;
    
    var self = this;
    request.onload = function(evt) {
    	self.loaded(evt.target.response);
    };
    
    request.onerror = function() {
    	//alert("Loader.onerror");
    };
    
    request.send();
};

Loader.prototype.loaded = function(res) {
	this.callback(res);
};
