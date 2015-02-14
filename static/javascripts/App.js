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
	
	this.weatherdata = {};
	this.map = {}; // Google map
	this.mapoptions = {}; // Google map options
	this.zoom = 16;
	
	this.iteration = 0;
	
	this.gps = {};
	
};

App.prototype.init = function() {
	this.addEventListeners();
	var self = this;
	this.gps = new GPS();
	this.gps.init(function(position) {
		self.loadedGPS(position);
	});
	/*
	// Load Images
	var image = document.createElement("img");
	image.src = this.DIAL_IMAGE_URL;
	var self = this;
    image.onload = function() {
        self.initDial(image);
    };
    */
};

App.prototype.loadedGPS = function(position) {
	//alert("App.loadedGPS");
	this.position = position;
	this.url = OPEN_WEATHER_MAP_URL+"lat="+position.coords.latitude+"&lon="+position.coords.longitude;
	//alert(this.url);
	var self = this;
	var JSONLoader = new Loader(function(data) {
		self.loadedWeatherData(data);
	});
	JSONLoader.load(this.url, 'json');
	
	//this.weatherdata.init(position, this.loadedWeatherData);
	//this.weatherdata.init(position, function() {
	//	alert("weatherdata: "+this.position.latitude);
	//	self.loadedWeatherData();
	//});
	//alert("App.initGPS url: "+url);
};

App.prototype.loadedWeatherData = function(data) {
	this.setData(data);
};

App.prototype.setData = function(data) {
	//alert("App.setData "+data);
	
	this.weatherdata.timestamp = this.formatDateTime(data.dt);
	this.weatherdata.currenttime = Date.now();
	
	var diff = this.weatherdata.currenttime-data.dt*1000;
	//alert("diff: "+diff);
	//var datediff = new Date(diff);
	//alert("datediff: "+datediff);
	////this.weatherdate.latestupdate = diff;
	this.weatherdata.location = data.name;
	this.weatherdata.country = data.sys.country;
	this.weatherdata.longitude = Number(this.position.coords.longitude.toFixed(3));
	this.weatherdata.latitude = Number(this.position.coords.latitude.toFixed(3));
	//this.weatherdata.position = {"longitude":this.position.coords.longitude.toFixed(2), "latitude":this.position.coords.latitude.toFixed(2)};
	this.weatherdata.windspeed = (data.wind.speed*MPS_TO_MPH).toFixed(2)+" MPH";
	this.weatherdata.windangle = ((data.wind.deg+180) % 360).toFixed(2)+" Deg";
	this.weatherdata.cloud = data.clouds.all+"%";
	//this.weatherdata.weather = {"main":data.weather.main.toString(), "description":data.weather.description.toString()};
	this.weatherdata.temperature = (data.main.temp-KELVIN_TO_CELCIUS).toFixed(2)+" C";
	this.weatherdata.sunrise = this.formatDateTime(data.sys.sunrise);
	this.weatherdata.sunset = this.formatDateTime(data.sys.sunset);
	
	//alert(JSON.stringify(this.weatherdata, null, "\t"));
	
	this.createMap();
	//this.temperature_change = this.temperature_max-this.temperature_min;
	//this.station_date = this.data["dt"];
	//slert("loadedWeatherData app"+this.app);
	//this.callback(this.weatherdata);
	
	//alert("WeatherData print callback "+this.callback);
	//this.getTimeDifference(this.sunrise, this.sunset);
	
};

App.prototype.createMap = function() {
	//alert(this.position.coords.latitude.toFixed(3)+", "+this.position.coords.longitude.toFixed(3));
	alert(this.weatherdata.latitude+", "+this.weatherdata.longitude);
	this.divs["map-canvas"].style.width = window.screen.availWidth+"px"; 
	this.divs["map-canvas"].style.height = window.screen.availHeight+"px";
	
	this.mapoptions = {
		center: {lat: this.weatherdata.latitude, lng: this.weatherdata.longitude},
		zoom: this.zoom
    };
    this.map = new google.maps.Map(this.divs["map-canvas"], this.mapoptions);
};

App.prototype.initDial = function(img) {
	this.images["dial-div"] = img;	
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

App.prototype.update = function(iteration) {
	this.iteration = iteration;
	/*
	this.windspeed = (this.data["wind"]["speed"]*this.MPS_TO_MPH).toFixed(2);
	this.winddeg = Math.round(this.data["wind"]["deg"]+180);
	if (this.winddeg>360) this.winddeg-=360;
	this.temperature_change = this.temperature_max-this.temperature_min;
	this.gps.update();
	this.render();
	*/
	this.print();
	//this.weather_data.update(data);
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

App.prototype.formatDateTime = function(timestamp) {
	// create a new javascript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds
	var date = new Date(timestamp*1000);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
	var day = date.getDate();
	var month = "0"+(date.getMonth()+1);
	// years begin at 1900
	var year = date.getYear()+1900;
	var formattedDate = day+"/"+month+"/"+year;
	return formattedTime+" "+formattedDate;
};

App.prototype.print = function() {
	//var type = this.data;
	var br = "<br/>";
	var nb = "&nbsp;";
	var out = "<b>DEBUG: </b>";
	out += "ITERATION: "+this.iteration+br;
	out += "SCREEN RES: "+this.divs["map-canvas"].style.width+" : "+this.divs["map-canvas"].style.height+br;
	out += JSON.stringify(this.weatherdata, null, br);
	//out += this.gps.print()+br;
	//out += this.weather_data.print();

	this.debug = out;
	if (this.SHOW_DEBUG)
		this.divs["debug"].innerHTML = this.debug;
};