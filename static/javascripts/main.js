const TEST_LOCATIONS = [
	"London", "Sydney", "Perth", 
	"Bristol", "Margate", "Dover", 
	"London", "Harrow", "Edinburgh", 
	"Canterbury", "Glasgow", "Dublin", 
	"Plymouth", "Doha", "New York"
];

const TEST_COORDS = {
	"london": [ -0.13, 51.51 ], 
	"margate": [ 1.38617, 51.381321 ], 
	"saint-malo": [ -2.01667, 48.650002 ]
};

const TEST_ID_LOCATION = {
	"margate": 2643044, 
	"sydney": 2147714, 
	"saint-malo": 2978640, 
	"london": 2643743
};

const TEST_URL = "http://api.openweathermap.org/data/2.5/weather?lat="+TEST_COORDS["margate"][1]+"&lon="+TEST_COORDS["margate"][0];

const GOOGLE_MAPS_API_KEY = "AIzaSyAAIjBYnsLq4pxsRkTOAdGV3C9aNzeGJf8";

const REFRESH_RATE = 5000; // milliseconds

const SCREEN_RESOLUTIONS = {
	"iphone3": {"width": 320, "height":480}, 
	"iphone4": {"width": 640, "height":960}, 
	"iphone5": {"width": 640, "height":1136}, 
	"iphone6": {"width": 750, "height":1334}, 
	"iphone6+": {"width": 1242, "height":2208}, 
};

var screen_resolution;

var iteration = 0;

var app; // Main App

var map; // Google map

var divs = {}; // HTML div elements
var images = {}; // HTML img elements
var canvas, context; // HTML canvas elements

var timerID = 0;
var JSONLoader;

var click = false;
var clickdiff = {};
var mousepos = {"x":0, "y":0};

		
function init() {
	
	//alert(TEST_URL);
	
	// Get divs
	divs = {
		"root":document.getElementById("main"), 
		"title":document.getElementById("title"), 
		"text":document.getElementById("text"), 
		"email":document.getElementById("email"),
		"gps":document.getElementById("gps"),  
		"debug":document.getElementById("debug"),
		"dial-div":document.getElementById("dial-div"),  
		"map-canvas":document.getElementById("map-canvas")
	};
	
	screen_resolution = SCREEN_RESOLUTIONS["iphone3"];
	
	// Get canvas and 2d context
	canvas = document.getElementById("main-canvas");
	canvas.width = screen_resolution.width;
	canvas.height = screen_resolution.height;
	
    // Load JSON Data
	JSONLoader = new Loader(loadedJSON); 
		
	// init animation
	initAnimationFrame();
	
	// init divs
	initDivs();
	
	// init app
	app = new App(divs, images, canvas, screen_resolution);
	app.init();
	run();
	
}

// init divs
function initDivs() {
	var debug = divs["debug"];
	debug.onmousedown = function(e) {
		click = true;
		startDrag(e);
	};
	debug.onmouseup = function(e) {
		click = false;
	};
	debug.onmouseout = function(e) {
		click = false;
	};
	debug.onmousemove = function(e) {
		if (click)
			dragDebug(e);
	};
	//debug.style.offsetWidth = "100px";
	//debug.style.offsetHeight = "100px";
	//debug.style.width = screen_resolution.width;
	//debug.style.height = screen_resolution.height;
}

function startDrag(e) {
	var offsets = debug.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;
    mousepos.x = e.clientX;
    mousepos.y = e.clientY;
    var diffX = mousepos.x - left; 
    var diffY = mousepos.y - top;
    clickdiff = {"x":diffX, "y":diffY};
	debug.style.left = String(left+document.documentElement.scrollLeft)+"px"; 
	debug.style.top = String(top+document.documentElement.scrollTop)+"px";
}

function dragDebug(e) {
	var debug = divs["debug"];
	debug.style.position="absolute";
    var x = e.clientX;
    var y = e.clientY;
	debug.style.left = String(x-clickdiff.x)+"px";
	debug.style.top = String(y-clickdiff.y)+"px";
};

function run() {
	//alert("main.run "+TEST_URL);
	timerID = window.setTimeout(run, REFRESH_RATE);
	JSONLoader.load(TEST_URL, 'json');
};

function loadedJSON(json) {
	iteration++;
	app.update(json, iteration);
};

document.addEventListener("DOMContentLoaded", function() {init();});
