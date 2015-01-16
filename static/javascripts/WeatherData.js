var WeatherData = function() {
	this.data = {};
	this.longitude = TEST_COORDS["london"][1];
	this.latitude = TEST_COORDS["london"][0];
	this.windspeed = 0;
	this.winddeg = 0;
	this.windgust = 0;
	this.temperature = 0;
	this.temperature_min = 0;
	this.temperature_max = 0;
	this.temperature_change = 0;
	this.sunrise = 0;
	this.sunset = 0;
};

WeatherData.prototype.init = function() {
	//alert("WeatherData.init");
};

WeatherData.prototype.update = function(data) {
	//alert("WeatherData.update data:"+data);
	this.data = data;
	//this.data.longitude = data.longitude; 
	//this.data.latitude = data.latitude;
};

WeatherData.prototype.print = function() {
	var type = this.data;
	var br = "<br/>";
	var nb = "&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;";
	var out = "<b>DEBUG</b>"+br;
	/*
	out += "CURRENT DATE: "+this.printDate(new Date())+br;
	var station_date = new Date(this.convertDateTime(type.dt));
	out += "STATION DATE: "+this.printDate(station_date)+br;
	var latest = new Date()-station_date;
	out += "LATEST UPDATE: "+Math.floor((latest/60000))+" minutes"+br;
	out += "TEMPERATURE CHANGE: "+this.temperature_change+br;
	*/
	out += "LONGITUDE: "+this.latitude+br;
	out += "LATITUDE: "+this.longitude+br;
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
	return out;
	
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
