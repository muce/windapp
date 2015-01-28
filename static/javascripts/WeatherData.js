var WeatherData = function() {
	this.WIND_SPEED_MAX = 10;
	this.WIND_SPEED_MIN = 0;
	this.KELVIN_TO_CELCIUS = 273.15;
	this.MPS_TO_MPH = 2.23693629;
	this.FPS = 60;
	this.DECIMAL_SHIFT = "000";
	
	this.data = {};
	this.longitude = 0;
	this.latitude = 0;
	this.windspeed = 0;
	this.winddeg = 0;
	this.windgust = 0;
	this.cloud = 0;
	this.temperature = 0;
	this.temperature_min = 0;
	this.temperature_max = 0;
	this.temperature_change = 0;
	this.sunrise = 0;
	this.sunset = 0;
	this.location = "";
	this.country = "";
	this.station_date = "";
};

WeatherData.prototype.init = function() {
	//alert("WeatherData.init");
};

WeatherData.prototype.update = function(data) {
	this.data = data;
	this.longitude = this.data["coord"]["lon"];
	this.latitude = this.data["coord"]["lat"];
	this.windspeed = (this.data["wind"]["speed"]*this.MPS_TO_MPH).toFixed(2);
	this.winddeg = Math.round(this.data["wind"]["deg"]+180);
	if (this.winddeg>360) this.winddeg-=360;
	this.cloud = this.data["clouds"]["all"];
	this.temperature = (this.data["main"]["temp"]-this.KELVIN_TO_CELCIUS).toFixed(2);
	this.sunrise = this.convertDateTime(this.data["sys"]["sunrise"]);
	this.sunset = this.convertDateTime(this.data["sys"]["sunset"]);
	this.temperature_min = (this.data["main"]["temp_min"]-this.KELVIN_TO_CELCIUS).toFixed(2);
	this.temperature_max = (this.data["main"]["temp_max"]-this.KELVIN_TO_CELCIUS).toFixed(2);
	this.temperature_change = this.temperature_max-this.temperature_min;
	this.location = this.data["name"];
	this.country = this.data["sys"]["country"];
	this.station_date = this.data["dt"];
	
	//this.gps.update();
	//this.render();
	this.print();
	//this.weather_data.update(data);
};

WeatherData.prototype.print = function() {
	var br = "<br/>";
	var nb = "&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;";
	var out = br;
	out += "<b>WEATHER DATA</b>"+br;
	
	out += "LOCATION: "+this.location+", "+this.country+br;
	out += "DATE: "+this.printDate(new Date())+br;
	out += "COORDS: LON:"+this.longitude+nb+"LAT:"+this.latitude+br;
	
	var station_date = new Date(this.convertDateTime(this.station_date));
	var latest = new Date()-station_date;
	out += "LATEST UPDATE: "+Math.floor((latest/60000))+" minutes"+br;
	out += "WIND SPEED: "+this.windspeed+" MPH"+br;
	out += "WIND DIRECTION: "+this.winddeg+" DEGREES"+br;
	out += "CLOUD: "+this.cloud+"%"+br;
	out += "TEMPERATURE: "+this.temperature+" CELCIUS"+br;
	out += "SUNRISE: "+this.sunrise+br;
	out += "SUNSET: "+this.sunset+br;
	out += br;

	return out;
	
};

WeatherData.prototype.printDate = function(d) {
	var br = "<br/>";
	var nb = "&nbsp;"+"&nbsp;";
	var out = "";
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();
	var day = d.getDate();
	var month = d.getMonth()+1;
	var year = d.getFullYear();
	if (hour.toString().length==1)
		hour = "0"+hour.toString();
	if (minute.toString().length==1)
		minute = "0"+minute.toString();
	if (second.toString().length==1)
		second = "0"+second.toString();
	if (day.toString().length==1)
		day = "0"+day.toString();
	if (month.toString().length==1)
		month = "0"+month.toString();
	if (year.toString().length==1)
		year = "0"+year.toString();
	out += hour+":"+minute+":"+second+nb;
	out += day+"/"+month+"/"+year;
	return out;
};

WeatherData.prototype.convertDateTime = function(dt) {
	var rtn = new Date(Number(dt.toString()+this.DECIMAL_SHIFT)).toGMTString();
	return rtn;
};
