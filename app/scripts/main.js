/* global LokPlasmaBall */

/* jshint camelcase: false, sub: false, unused: false */

/**
 * !@license
 * Copyright WONG LOK 2014. All rights reserved.
 * Allrights reserved.
 * Referenced akm2
 * //http://jsdo.it/akm2/pQbM
 */




(function(){
	'use strict';


	var self = new LokPlasmaBall();


	function loop() {
		self.update();
		self.draw(self.context);
	}

	function startLoop(){
		window.requestAnimationFrame(function loopSiLoopSiLoop(){
			window.requestAnimationFrame(loopSiLoopSiLoop);
			loop();
		});
	}


	function init() {

		self.init();

		document.getElementById('lokPlasmaBall').appendChild(self.canvas);

		startLoop();


	}

	init();


}());
