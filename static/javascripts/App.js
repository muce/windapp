var App = function(divs, images, canvas, display) {
	this.SERVER_POLL_SPEED = 60; // Try every n seconds
	this.WIND_SPEED_MAX = 10;
	this.WIND_SPEED_MIN = 0;
	this.KELVIN_TO_CELCIUS = 273.15;
	this.MPS_TO_MPH = 2.23693629;
	this.FPS = 60;
	this.DECIMAL_SHIFT = "000";
	this.DIAL_IMAGE_URL = "static/images/arrow.svg.med.png";
	
	this.SHOW_DEBUG = true;
	this.debug = "no debug";
	
	this.divs = divs;
	this.images = images;
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	this.data = {};
	this.dial = null;
	
	this.display = display;
		
	this.timerID = 0;
	this.currentFrame = 0;
	this.timestamp = 0;
	this.windspeed = 0;
	this.winddeg = 0;
	this.windgust = 0;
	this.sunrise = 0;
	this.sunset = 0;
	this.lng = 150; 
	this.lat = 180; 
	
	this.weather_data = {};
	this.map = null;
	
	this.iteration = 0;
	
	this.gps = {};
	
};

App.prototype.initDial = function(img) {
	this.images["dial-div"] = img;
	this.weather_data = new WeatherData();
	this.weather_data.init();
	
	//var dia = new Image();
	//dia.src = this.DIAL_IMAGE_URL;
	//image.width = 128;
	//image.height = 64;
	//image.style.top = "100px";
	//image.style.left = "200px";
	/*
	var options = {
		context: this.context, 
		width: 100, //this.WIDTH, 
		height: 100, //this.HEIGHT, 
		image: dia, 
		numberOfFrames: 1, 
		ticksPerFrame: 8, 
		scaleRatio: 1, 
		x: 150, //this.x, 
		y: 150 //this.y
	};
	this.dial = new Sprite(options);
	this.dial.update(50, 50);
	this.dial.render();
	*/
};

App.prototype.init = function() {
	this.addEventListeners();
	this.gps = new GPS(divs["gps"], this);
	this.gps.init(this.initGPS);
	// Load Images
	var image = document.createElement("img");
	image.src = this.DIAL_IMAGE_URL;
	var self = this;
    image.onload = function() {
        self.initDial(image);
    };
};

App.prototype.initGPS = function(data, self) {
	this.timestamp = data.timestamp;
	this.map = new Map(divs["map-canvas"]);
	this.map.init(data.coords, self.display);
};

App.prototype.update = function(data, iteration) {
	this.data = data;
	this.iteration = iteration;
	this.windspeed = (this.data["wind"]["speed"]*this.MPS_TO_MPH).toFixed(2);
	this.winddeg = Math.round(this.data["wind"]["deg"]+180);
	if (this.winddeg>360) this.winddeg-=360;
	this.temperature_change = this.temperature_max-this.temperature_min;
	this.gps.update();
	this.render();
	this.print();
	this.weather_data.update(data);
};

App.prototype.updateInput = function() {
	
};

App.prototype.render = function() {
	var w = this.images["dial-div"].width/4;
	var h = this.images["dial-div"].height/4;
	var scr_width = window.screen.availWidth;
	var scr_height = window.screen.availHeight;
	
	var x = -w/2; 
	var y = -h/2;
	
	this.context.clearRect(0 ,0, this.canvas.width, this.canvas.height);
	this.context.save();
    this.context.translate(this.canvas.width/2, this.canvas.height/2);
    this.context.rotate(this.winddeg*Math.PI/180);
    this.context.drawImage(this.images["dial-div"], x, y, w, h);
	this.context.restore();
};

App.prototype.tap = function(e) {
	alert(e);
};

App.prototype.addEventListeners = function() {

};

App.prototype.print = function() {
	var type = this.data;
	var br = "<br/>";
	var nb = "&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;";
	var out = "<b>DEBUG: </b>";
	out += "ITERATION: "+this.iteration+br;
	out += "SCREEN RES: "+this.display.width+"x"+this.display.height+br;
	//out += this.gps.print()+br;
	out += this.weather_data.print();

	this.debug = out;
	if (this.SHOW_DEBUG)
		this.divs["debug"].innerHTML = this.debug;
};