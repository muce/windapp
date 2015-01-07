var Sprite = function(options) {

	this.options = options;
	this.frameIndex = 0;
	this.frameStart = 0;
	this.tickCount = 0;
	this.ticksPerFrame = this.options.ticksPerFrame || 0;
	this.numberOfFrames = this.options.numberOfFrames || 1;
	this.context = this.options.context;
	this.width = this.options.width*this.numberOfFrames;
	this.height = this.options.height;
	this.x = this.options.x;
	this.y = this.options.y;
	this.image = this.options.image;
	this.scaleRatio = this.options.scaleRatio;
	
	//this.print();

};

Sprite.prototype.setFrameStart = function(i) {
	this.frameStart = i;
};

Sprite.prototype.update = function(x, y) {
	//alert("Sprite.update x:"+x+", y:"+y);
	this.tickCount++;
	if (this.tickCount>this.ticksPerFrame) {
		this.tickCount = 0;
		if (this.frameIndex<this.numberOfFrames-1)
			this.frameIndex++;
		else
			this.frameIndex = 0;
	};
	this.x = x;
	this.y = y;
};

Sprite.prototype.render = function() {
	
	var out = "Sprite.render"+"\n";
	out += "this.image:"+this.image+"\n"; 
	out += "something:"+(this.frameIndex+this.frameStart)*this.width/this.numberOfFrames+"\n"; 
	out += "something:"+0+"\n"; 
	out += "w:"+this.width/this.numberOfFrames+"\n"; 
	out += "h:"+this.height+"\n"; 
	out += "x:"+this.x+"\n"; 
	out += "y:"+this.y+"\n"; 
	out += "scaleX:"+this.width/this.numberOfFrames*this.scaleRatio+"\n"; 
	out += "scaleY:"+this.height*this.scaleRatio+"\n"; 
		
	alert(out);
	
	this.context.drawImage(
		this.image, 
		(this.frameIndex+this.frameStart)*this.width/this.numberOfFrames, 
		0, 
		this.width/this.numberOfFrames, 
		this.height, 
		this.x, 
		this.y, 
		this.width/this.numberOfFrames*this.scaleRatio, 
		this.height*this.scaleRatio
	);
	//alert("Sprite.render this.context:"+this.context+", x:"+this.x+", y:"+this.y);
};

Sprite.prototype.print = function() {
	var out = "";
	for (var i in this.options) {
		out +=i+": "+this.options[i]+"\n";
	}
	alert(out);
};
