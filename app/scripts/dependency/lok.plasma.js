/* global Point */
/* global Lightning */


/**
 * !@license
 * Copyright WONG LOK 2014. All rights reserved.
 * Allrights reserved.
 * Referenced akm2
 * //http://jsdo.it/akm2/pQbM
 */

(function(global){

	function PlasmaPoint(){
		Point.apply(this,arguments);
	}
	PlasmaPoint.prototype = Object.create(Point.prototype);

	PlasmaPoint.prototype.draw = function(context) {
		var self = this;
		context.save();
		context.shadowBlur = 1;

		context.shadowColor = 'rgba(224, 100, 255, 0.2)';
		context.fillStyle = 'rgba(224, 100, 255, 1)';
		context.globalCompositeOperation = 'lighter';

		context.beginPath();
		context.arc(self.x, self.y, 1, 0, Math.PI * 2, false);
		context.closePath();

		context.fill();
		context.restore();
	};




	function LokPlasmaBall(){
		var self = this;


		var canvas = this.canvas = document.createElement('canvas');
		var context = this.context = canvas.getContext('2d');

		var
		innerDots = [],
		outerDots = [],

		innnerRadius = 30,
		outerRadius = 300,

		lightningType = []
		;

		var lines = 33,
			disabledLines = [],
			centerX,
			centerY
		;



		self.iPointers = [
			{
				x: 0,
				y: 0,
			}
		];

		self.mouse = {
			x: 0,
			y: 0,
			down: false,
			touch: []
		};

		//change number of lightling
		self.percentageVisible = 0.75;

		self.resize = function(){
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		self.init = function(){

			self.resize();
			self.updateSpace();

			self.instDots();
			self.instBolt();
			self.instThickThunder();
			self.instThinThunder();

			self.instRandomLight();
		};


		self.instBolt = function(){
			//sparkle
			var lightning;
			lightning = new Lightning();
			lightning.step(10);
			lightning.childNum(2);
			lightning.blur = 250;
			lightning.lineWidth = 1;
			lightningType.push(lightning);
		};

		self.instThickThunder = function(){
			//sparkle
			var lightning;
			lightning = new Lightning();
			lightning.step(16);
			lightning.childNum(1);
			lightning.lineWidth = 2;
			lightningType.push(lightning);
		};

		self.instThinThunder = function(){
			var lightning;
			lightning = new Lightning();
			lightning.step(16);
			lightning.childNum(0);
			lightning.lineWidth = 1;
			lightningType.push(lightning);
		};

		self.displayPortion = function(portion){
			var timesToDisable = lines - Math.ceil( (portion * lines * self.percentageVisible) ) ;
			var i= 0;

			disabledLines.length = 0;

			for (; i < timesToDisable; i++) {
				var indexOfDisabledLine = Math.ceil(Math.random() * lines);
				disabledLines.push(indexOfDisabledLine);
			}
		};

		self.getRandomMin = function(){
			var random = Math.random();
			var lowThreshold = 0.3;
			if (random < lowThreshold){
				random += lowThreshold;
			}
			return random;
		};

		self.instRandomLight = function(){
			var random = self.getRandomMin();
			self.randommTimer = setInterval(function(){
				random = self.getRandomMin();
				self.displayPortion(random);
			},1000);
			self.displayPortion(random);
		};
		self.stopRandomLight = function(){
			clearTimeout(self.randomTimer);
		};

		self.updateSpace = function(){

			centerX = canvas.width/2;
			centerY = canvas.height/2;

			innnerRadius = 25;
			outerRadius = canvas.width < canvas.height ? (canvas.width/3) : (canvas.height/3);

			// self.needsUpdate = true;
		};

		self.calcNewCircleX = function(radius, i, offset){
			return (centerX + radius * Math.cos( (2 * Math.PI) * (i/lines) * (1+offset) ) );
		};
		self.calcNewCircleY = function(radius, i, offset){
			return (centerY + radius * Math.sin( (2 * Math.PI) * (i/lines) * (1+offset) ) );
		};
		self.initDotArray = function(radius, array){
			var i = 0;
			for (; i < lines; i++) {
				array[i] = new PlasmaPoint(
					self.calcNewCircleX(radius, i, 0),
					self.calcNewCircleY(radius, i, 0)
				);
			}
		};

		self.instDots = function(){
			self.initDotArray(outerRadius, outerDots);
			self.initDotArray(innnerRadius, innerDots);
		};


		var off = 0;
		self.updateDotsCirclePos = function(radius, array, special){
			var i = 0;
			for (; i < lines; i++) {

				if (special){
					array[i].x = self.calcNewCircleX(radius, i, Math.cos(off) * Math.tan(off+0.1));
					array[i].y = self.calcNewCircleY(radius, i, Math.sin(off) * Math.tan(off+0.1));
					continue;
				}


				array[i].x = self.calcNewCircleX(radius, i, off);
				array[i].y = self.calcNewCircleY(radius, i, off);
			}
		};

		self.withinCircle = function(mouseX,mouseY,centerX,centerY,radius){
			return (Math.sqrt((mouseX-centerX)*(mouseX-centerX) + (mouseY-centerY)*(mouseY-centerY)) < radius);
		};

		self.withinPlamsaBall = function(){
			return self.withinCircle(self.mouse.x,self.mouse.y,centerX,centerY,outerRadius);
		};

		self.updateDotsMiltitouchPos = function(radius, array){

			if (!self.mouse.touch){
				return;
			}

			var i = 0;
			var withinCircle = self.withinPlamsaBall();
			var touchListLength = self.mouse.touch.length;
			var touchListLengthRatio = 1/touchListLength;

			for (; i < lines; i++) {

				if (withinCircle){

					for (var touchItem = self.mouse.touch.length - 1; touchItem >= 0; touchItem--) {
						var val = self.mouse.touch[touchItem];

						if (Math.random() < touchListLengthRatio){
							var mtX,mtY;

							mtX = val.clientX - self.mouse.rect.left;
							mtY = val.clientY - self.mouse.rect.top;

							if (!self.withinCircle(mtX,mtY,centerX,centerY,outerRadius)){
								mtX = self.calcNewCircleX(radius, i, off);
								mtY = self.calcNewCircleY(radius, i, off);
							}
							array[i].x = mtX;
							array[i].y = mtY;
						}
					}
				}else{
					array[i].x = self.calcNewCircleX(radius, i, off);
					array[i].y = self.calcNewCircleY(radius, i, off);
				}

			}

		};
		self.updateDotsMousePos = function(radius, array){
			var i = 0;
			var withinCircle = self.withinPlamsaBall();

			for (; i < lines; i++) {
				if (withinCircle && Math.random() < 0.96){
					array[i].x = self.mouse.x;
					array[i].y = self.mouse.y;
				}else{
					array[i].x = self.calcNewCircleX(radius, i, off);
					array[i].y = self.calcNewCircleY(radius, i, off);
				}
			}
		};


		self.update = function(){
			off = off + 0.025 * Math.random();

			if (!self.mouse.down){
				//circle noraml mode
				self.updateDotsCirclePos(outerRadius, outerDots);
				self.updateDotsCirclePos(innnerRadius, innerDots);
			}else{

				if (self.mouse.touch && self.mouse.touch.length > 1){
					//multi touch mode
					self.updateDotsMiltitouchPos(outerRadius, outerDots);
				}else{
					//single touch/mouse
					self.updateDotsMousePos(outerRadius, outerDots);
				}

				self.updateDotsCirclePos(innnerRadius, innerDots, true);
			}

		};

		self.renderOuterBall = function(context){
			context.beginPath();
			context.arc(centerX, centerY, outerRadius + 5, 0, 2 * Math.PI, false);
			// context.fillStyle = 'green';
			// context.fill();
			context.lineWidth = 1;
			context.strokeStyle = '#fff';
			context.stroke();
		};

		self.renderInnerBall = function(context){
			context.beginPath();
			context.arc(centerX, centerY, innnerRadius - 3, 0, 2 * Math.PI, false);
			// context.fillStyle = 'green';
			// context.fill();
			context.lineWidth = 1;
			context.strokeStyle = '#fff';
			context.stroke();
		};

		self.renderRod = function(context){

			var rWidth = innnerRadius/4;
			var rHeight = outerRadius - innnerRadius + 8;

			var rTop = centerY + innnerRadius - 3;
			var rLeft = centerX - rWidth/2;

			context.rect(rLeft, rTop, rWidth, rHeight);
			context.stroke();
		};

		self.renderLightning = function(lightning,pIndex){

			outerDots[pIndex].draw(context, true);

			lightning.start(innerDots[pIndex]);
			lightning.end(outerDots[pIndex]);
			lightning.update();
			lightning.updateGradient(self.getRandomGradient(context));
			lightning.draw(context);

		};

		self.getRandomThunderColorPurple = function(){
			var random = Math.random();
			var result;
			if (random <= 0.1){
				result = 'rgba(200, 255, 255,'+ (Math.random()+0.65) +')';
			}else if (random <= 0.2){
				result = 'rgba(255, 0, 255,'+ (Math.random()+0.65) +')';
			}else if (random <= 0.3){
				result = 'rgba(200, 0, 255,'+ (Math.random()+0.65) +')';
			}else if (random <= 0.4){
				result = 'rgba(200, 0, 200,'+ (Math.random()+0.65) +')';
			}else if (random <= 0.5){
				result = 'rgba(150, 0, 150,'+ (Math.random()+0.65) +')';
			}else{
				result = 'rgba(100, 0, 100,'+ (Math.random()+0.65) +')';
			}
			return result;
		};

		self.getRandomThunderColor = function(){
			var random = Math.random();
			var result;
			if (random <= 0.1){
				result = 'rgba(200, 255, 255,'+ (Math.random()+0.65) +')';
			}else if (random <= 0.2){
				result = 'rgba(255, 255, 255,'+ (Math.random()+0.65) +')';
			}else if (random <= 0.3){
				result = 'rgba(200, 0, 255,'+ (Math.random()+0.65) +')';
			}else if (random <= 0.4){
				result = 'rgba(200, 0, 200,'+ (Math.random()+0.65) +')';
			}else if (random <= 0.5){
				result = 'rgba(150, 0, 150,'+ (Math.random()+0.65) +')';
			}else if (random <= 0.6){
				result = 'rgba(100, 0, 100,'+ (Math.random()+0.65) +')';
			}else{
				result = 'rgba(150, 0, 255,'+ (Math.random()+0.65) +')';
			}
			return result;
		};

		self.getGradient = function(ctx){
			var gradient = ctx.createLinearGradient(0,0,1000,0);
			gradient.addColorStop(0,self.getRandomThunderColorPurple());
			gradient.addColorStop(0.2,self.getRandomThunderColor());
			// gradient.addColorStop(0.3,self.getRandomThunderColor());
			// gradient.addColorStop(0.7,self.getRandomThunderColor());
			gradient.addColorStop(1,self.getRandomThunderColor());

			return gradient;
		};


		var gradientCache;
		self.getRandomGradient = function(ctx){
			var result;
			var random = Math.random();
			if (random <= 0.05){
				result = self.getGradient(ctx);
			}else if (random <= 0.2){
				result = self.getGradient(ctx);
			}else if (random <= 0.3){
				result = self.getGradient(ctx);
			}else if (random <= 0.4){
				result = self.getGradient(ctx);
			}else if (random <= 0.5){
				result = self.getGradient(ctx);
			}else{
				if(!!!gradientCache){
					gradientCache = self.getGradient(ctx);
				}
				result = gradientCache;
			}
			return result;
		};

		//self.getRandomGradient(ctx);

		self.draw = function(context){

			self.context.fillStyle = '#060C2A';
			self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);


			self.renderInnerBall(context);
			self.renderOuterBall(context);
			self.renderRod(context);

			var random;
			for (var pIndex = outerDots.length - 1; pIndex >= 0; pIndex--) {

				if (pIndex in disabledLines) { continue; }

				random = Math.random();

				//percent
				if (random <= 0.01){
					self.renderLightning(lightningType[0],pIndex);
				}else if (random <= 0.03){
					self.renderLightning(lightningType[1],pIndex);
				}else if (random <= 0.15){
					self.renderLightning(lightningType[2],pIndex);
				}

				if (random <= 0.16){
					outerDots[pIndex].draw(context);
				}else{
					innerDots[pIndex].draw(context);
				}
			}


			context.save();
			context.font = "20pt Arial";
			context.fillText("Sample String", 10, 50);
			context.restore();

		};
	}



	global.LokPlasmaBall = LokPlasmaBall;

}(window));




