var App = function(divs, images, canvas, display) {
	this.SERVER_POLL_SPEED = 10; // Try every n seconds
	this.WIND_SPEED_MAX = 10;
	this.WIND_SPEED_MIN = 0;
	this.KELVIN_TO_CELCIUS = 273.15;
	this.MPS_TO_MPH = 2.23693629;
	this.FPS = 60;
	this.DECIMAL_SHIFT = "000";
	this.DIAL_IMAGE_URL = "static/images/arrow.svg.med.png";
	
	this.divs = divs;
	this.images = images;
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	this.data = {};
	this.dial = null;
	
	this.SHOW_DEBUG = true;
	this.debug = "no debug";
	
	this.display = display;
		
	this.timerID = 0;
	this.currentFrame = 0;
	
	this.lat = 1;
	this.lng = 30;
	this.timestamp = 0;
	
	this.windspeed = 0;
	this.winddeg = 0;
	this.windgust = 0;
	this.temperature = 0;
	this.temperature_min = 0;
	this.temperature_max = 0;
	this.temperature_change = 0;
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
	//self.lng = data.coords.longitude;
	//self.lat = data.coords.latitude;
	//alert("GPS self.lng="+self.lng+", self.lat="+self.lat);
	//alert("display lng"+self.display.lng+", lat"+self.display.lat);
	this.map = new Map(divs["map-canvas"]);
	this.map.init(data.coords, self.display);
	/*
	this.map.init({
		"lat": 52, 
		"lng": 1.4
	}, 
	self.display);
	*/
};

App.prototype.update = function(data, iteration) {
	this.data = data;
	this.iteration = iteration;
	this.longitude = this.data["coord"]["lon"];
	this.latitude = this.data["coord"]["lat"];
	this.windspeed = (this.data["wind"]["speed"]*this.MPS_TO_MPH).toFixed(2);
	this.winddeg = Math.round(this.data["wind"]["deg"]+180);
	if (this.winddeg>360) this.winddeg-=360;
	this.temperature = (this.data["main"]["temp"]-this.KELVIN_TO_CELCIUS).toFixed(2);
	this.sunrise = this.convertDateTime(this.data["sys"]["sunrise"]);
	this.sunset = this.convertDateTime(this.data["sys"]["sunset"]);
	this.temperature_min = (this.data["main"]["temp_min"]-this.KELVIN_TO_CELCIUS).toFixed(2);
	this.temperature_max = (this.data["main"]["temp_max"]-this.KELVIN_TO_CELCIUS).toFixed(2);
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
	out += "SCREEN WIDTH: "+this.display.width+br;
	out += "SCREEN HEIGHT: "+this.display.height+br;
	//var type = this.default_types;
	out += "LOCATION: "+type.name+", "+type.sys.country+br;
	out += this.gps.print()+br;
	out += "DATE: "+this.printDate(new Date())+br;
	var station_date = new Date(this.convertDateTime(type.dt));
	//out += "STATION DATE: "+this.printDate(station_date)+br;
	var latest = new Date()-station_date;
	out += "LATEST UPDATE: "+Math.floor((latest/60000))+" minutes"+br;
	out += "WIND SPEED: "+this.windspeed+" MPH"+br;
	out += "WIND DIRECTION: "+this.winddeg+br;
	out += "CLOUD: "+type.clouds.all+"%"+br;
	out += "TEMPERATURE: "+this.temperature+" CELCIUS"+br;
	
	//out += "GPS: LNG: "+this.gps.getCoords()["lng"]+br;
	//out += "GPS: LAT: "+this.gps.getCoords()["lat"]+br;
	
	//out += "WEATHER DATA PRINT: "+this.weather_data.print()+br;
	
	/*
	for (var i in type) {
		switch (i) {
			case "wind":
				out += i.toUpperCase()+br;
				for (var j in type[i]) {
					switch (j) {
						case "speed":
							out += nb+"Speed: "+this.windspeed+" MPH"+br;
							break;
						case "deg":
							out += nb+"Direction: "+this.winddeg+" DEG"+br;
							break;
					}
				}
				break;
			case "base":
			case "name":
			case "cod":
			case "id":
				out += i.toUpperCase()+": "+type[i]+br;
				break;
			case "coord":
				out += "LONGITUDE: "+this.longitude+br;
				out += "LATITUDE: "+this.latitude+br;
				break;
			case "clouds":
				out += i.toUpperCase()+br;
				for (var j in type[i]) {
					switch (j) {
						case "all":
							out += nb+"All: "+type[i][j]+br;
							break;
					}
				}
				break;
			case "sys":
				out += i.toUpperCase()+br;
				for (var j in type[i]) {
					switch (j) {
						case "sunrise":
							out += nb+"Sunrise: "+this.printDate(new Date(this.sunrise))+br;
							break;
						case "sunset":
							out += nb+"Sunset: "+this.printDate(new Date(this.sunset))+br;
							break;
						case "message":
							out += nb+"Message: "+type[i][j]+br;
							break;
						case "country":
							out += nb+"Country: "+type[i][j]+br;
							break;
					}
				}
				break;
			case "main":
				out += i.toUpperCase()+br;
				for (var j in type[i]) {
					switch (j) {
						case "temp":
							out += nb+j+": "+this.temperature+br;
							break;
						case "temp_min":
							out += nb+j+": "+this.temperature_min+br;
							break;
						case "temp_max":
							out += nb+j+": "+this.temperature_max+br;
							break;
						default:
							out += nb+j+": "+type[i][j]+br;	
					}
					
				}
				break;
		}
		
	}
	*/
	this.debug = out;
	if (this.SHOW_DEBUG)
		this.divs["debug"].innerHTML = this.debug;
};

App.prototype.printDate = function(d) {
	var br = "<br/>";
	var nb = "&nbsp;"+"&nbsp;";
	var out = "";
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	out += h+":"+m+":"+s+nb;
	out += d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
	return out;
};

App.prototype.convertDateTime = function(dt) {
	//alert("convertDateTime: "+dt);
	var rtn = new Date(Number(dt.toString()+this.DECIMAL_SHIFT)).toGMTString();
	return rtn;
};
