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


	function work() {
		// self.itensity = Math.random();
		self.update();
		self.draw(self.context);
	}

	function startLoop(){
		window.requestAnimationFrame(function hyperloop(){
			window.requestAnimationFrame(hyperloop);
			work();
		});
	}


	function init() {

		self.init('lokPlasmaBall');

		startLoop();


	}

	init();


}());
