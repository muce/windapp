var WeatherData = function(app) {
	this.app = app;
	this.div = divs["weather-data"];
	this.JSONLoader = {};
	this.data = {};
	this.weatherdata = {};
	this.callback = null;
};

WeatherData.prototype.init = function(position, callback) {
	this.position = position;
	this.callback = callback;
	this.url = OPEN_WEATHER_MAP_URL+"lat="+position.coords.latitude+"&lon="+position.coords.longitude;
	alert(this.url);
	var self = this;
	this.JSONLoader = new Loader(function(data) {
		self.loadedData(data);
	});
	this.JSONLoader.load(this.url, 'json');
};
