/**
 * !@preserve
 * Lightling class
 * @see http://jsdo.it/akm2
 */


/* global Point */
/* global PerlinNoise */
/* global Timer */

(function(){
	'use strict';

	PerlinNoise.useClassic = true;

	/**
	 * Lightning
	 */
	function Lightning(startPoint, endPoint, stepNum) {
		var self = this;

		var start = startPoint || new Point();
		var end = endPoint || new Point();
		var step = stepNum || 45;

		// var length = start.distance(end);

		var perlinNoise = new PerlinNoise(Math.floor(Math.random() * 1000) + 1);
		perlinNoise.octaves(6);
		//perlinNoise.fallout(0.5);

		var off = 0;
		var points;

		var children = [];

		// case by child
		var parent = null;
		var startStep = 0;
		var endStep = 0;
		var timer;

		// speed
		self.speed = 0.02;

		// line width
		self.lineWidth = 1.5;

		// blur size and color
		self.blur = false;
		self.blurColor = 'rgba(255, 255, 255, 0.75)';

		self.gradient = 'rgb(255,255,255, 0.2)';

		self.start = function(x, y) {
			if (!arguments.length) { return start.clone(); }
			start.set(x, y);
		};

		self.end = function(x, y) {
			if (!arguments.length) { return end.clone(); }
			end.set(x, y);
		};

		self.step = function(n) {
			if (!arguments.length) { return step; }
			step = Math.floor(n);
		};

		self.length = function() {
			return start.distance(end);
		};

		self.point = function(index) {
			return points[index];
		};

		self.childNum = function(num) {
			if (arguments.length === 0) { return children.length; }

			if (children.length > num) {
				children.splice(num, children.length - num);
			} else {
				for (var i = children.length, child; i < num; i++) {
					child = new Lightning();
					child.speed = 0.03;
					child.lineWidth = 1.5;
					child.setAsChild(self);
					children.push(child);
				}
			}
		};

		self.plasmaBall = function(num) {
			if (children.length > num) {
				children.splice(num, children.length - num);
			} else {
				for (var i = children.length, child; i < num; i++) {
					child = new Lightning();
					child.speed = 0.03;
					child.lineWidth = 1.5;
					child.setAsChild(self);
					children.push(child);
				}
			}
		};

		self.setAsChild = function(lightning) {
			if (!(lightning instanceof Lightning)) {return;}

			parent = lightning;

			timer = new Timer(Math.floor(Math.random() * 1500) + 1);
			timer.onTimer = function() {
				this.delay = Math.floor(Math.random() * 1500) + 1;
				self.getStepsFromParent();
			};
			timer.start();
		};

		self.getStepsFromParent = function() {
			if (!parent) {return;}
			var parentStep = parent.step();
			startStep = Math.floor(Math.random() * (parentStep - 2));
			endStep = startStep + Math.floor(Math.random() * (parentStep - startStep - 2)) + 2;
		};

		self.needsUpdate = false;

		/*
		var na,ax,ay,
			nb,bx,by,
			m,
			x,y;
		 */

		self.updatePointWithPerlinNoiseChromeOptimized = function(len, i, sin, cos, off, normal, length, points){
			var na,ax,ay,
			nb,bx,by,
			m,
			x,y;

			na = length * perlinNoise.noise(i / 50 - off) * 1.5;
			ax = sin * na;
			ay = cos * na;

			nb = length * perlinNoise.noise(i / 50 + off) * 1.5;
			bx = sin * nb;
			by = cos * nb;

			m = Math.sin(	Math.PI * (i / (len - 1))	);

			x = start.x + normal.x * i + (ax - bx) * m;
			y = start.y + normal.y * i - (ay - by) * m;

			//lazy instantiate points within array.
			points[i] = points[i] || new Point(x,y);
			points[i].x = x;
			points[i].y = y;
		};

		self.update = function() {
			if (parent) {
				if (endStep > parent.step()) {
					this.getStepsFromParent();
				}

				start.set(parent.point(startStep));
				end.set(parent.point(endStep));
			}


			var length = self.length();
			var normal = end.subtract(start).normalize(length / step);
			var rad = normal.angle();
			var sin = Math.sin(rad);
			var cos = Math.cos(rad);
			var i, len;

			//lazy instantiate points array
			points = points || [];
			if (self.needsUpdate){
				points = [];
				self.needsUpdate = false;
			}


			off += self.speed;


			// var na,ax,ay,
			// nb,bx,by,
			// m,
			// x,y;
			for (i = 0, len = step + 1; i < len; i++) {

				self.updatePointWithPerlinNoiseChromeOptimized(len, i, sin, cos, off, normal, length, points);

				//------------------
				// var na,ax,ay,
				// nb,bx,by,
				// m,
				// x,y;

				// na = length * perlinNoise.noise(i / 50 - off) * 1.5;
				// ax = sin * na;
				// ay = cos * na;

				// nb = length * perlinNoise.noise(i / 50 + off) * 1.5;
				// bx = sin * nb;
				// by = cos * nb;

				// m = Math.sin((Math.PI * (i / (len - 1))));

				// x = start.x + normal.x * i + (ax - bx) * m;
				// y = start.y + normal.y * i - (ay - by) * m;


				//------------------
				// points[i] = points[i] || new Point(x,y);
				// points[i].x = x;
				// points[i].y = y;


				//------------------
				// points.push(new Point(x, y));


			}

			// Update children
			for (i = 0, len = children.length; i < len; i++) {
				children[i].update();
			}
		};

		self.updateGradient = function(gradient){
			self.gradient = gradient;
		};

		self.draw = function(ctx) {
			var i, len, p;

			//
			if (self.blur) {
				var d;
				ctx.save();
				ctx.globalCompositeOperation = 'lighter';
				ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
				ctx.shadowBlur = self.blur;
				ctx.shadowColor = self.blurColor;
				ctx.beginPath();
				i = 0;
				len = points.length;
				for (; i < len; i++) {
					p = points[i];
					d = len > 1 ? p.distance(points[i === len - 1 ? i - 1 : i + 1]) : 0;
					ctx.moveTo(p.x + d, p.y);
					ctx.arc(p.x, p.y, d, 0, Math.PI * 2, false);
				}
				ctx.fill();
				ctx.shadowBlur = 0;
				ctx.restore();
			}


			ctx.strokeStyle = self.gradient;


			ctx.save();
			ctx.lineWidth = Math.random() * self.lineWidth + 1;
			ctx.beginPath();

			i = 0;
			len = points.length;
			for (; i < len; i++) {
				p = points[i];
				ctx[i === 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
			}

			ctx.stroke();
			ctx.restore();






			// Draw children
			for (i = 0, len = children.length; i < len; i++) {
				children[i].draw(ctx);
			}
		};
	}

	window.Lightning = Lightning;

}());



