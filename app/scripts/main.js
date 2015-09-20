/* global LokPlasmaBall */
/* global base64 */

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

	var plasmaBall,
		lok = window.lok = {}
	;


	var STATE = {
		seed: Math.random().toFixed(2),
		'numSports': null,
		'numNewPeople': null,
		'typeMusic': null,
		'numCupWine': null,
		'perMemoryLeft': null,
		'perLightning':0.75
	};


	var target = {};
	var slider = {};
	var radio = {};

	function resize() {
		plasmaBall.canvas.width = window.innerWidth;
		plasmaBall.canvas.height = window.innerHeight;
	}



	function initCanvas(){
		// canvas = ;
		// context = canvas.getContext('2d');

		window.lok.plasmaBall = window.lok.plasmaBall || {};

		window.lok.plasmaBall = plasmaBall = new LokPlasmaBall();
		resize();
		plasmaBall.init();
		plasmaBall.percentageVisible = STATE['perLightning'];


		document.getElementById('lokPlasmaBall').appendChild(plasmaBall.canvas);

		window.addEventListener('resize', window.debounce(resize, 100, true), true);

		function listenToCanvas(){
			plasmaBall.canvas.addEventListener('mousemove', mouseMove, false);
			plasmaBall.canvas.addEventListener('mousedown', mouseDown, false);
			plasmaBall.canvas.addEventListener('mouseup', mouseUp, false);

			plasmaBall.canvas.addEventListener('touchmove', touchMove, false);
			plasmaBall.canvas.addEventListener('touchstart', mouseDown, false);

			plasmaBall.canvas.addEventListener('touchend', mouseUp, false);
			plasmaBall.canvas.addEventListener('touchcancel', mouseUp, false);
			plasmaBall.canvas.addEventListener('touchleave', mouseUp, false);

		}
		listenToCanvas();

		function touchMove(e){

			var rect = plasmaBall.canvas.getBoundingClientRect();

			var mx = e.touches[0].clientX - rect.left,
			my = e.touches[0].clientY - rect.top;

			plasmaBall.mouse.x = mx;
			plasmaBall.mouse.y = my;

			plasmaBall.mouse.touch = e.touches;
			plasmaBall.mouse.rect = rect;

			if (plasmaBall.withinPlamsaBall()){
				e.preventDefault();
			}else{
				plasmaBall.mouse.down = false;
			}

			//		console.log(e);

			return false;
		}

		function mouseMove(e) {
			var rect = plasmaBall.canvas.getBoundingClientRect();

			var mx = e.clientX - rect.left,
			my = e.clientY - rect.top;

			plasmaBall.mouse.x = mx;
			plasmaBall.mouse.y = my;

		}

		function mouseDown(e) {
			plasmaBall.mouse.down = true;
			document.body.style.cursor = 'pointer';
		}

		function mouseUp(e) {
			plasmaBall.mouse.down = false;
			document.body.style.cursor = 'default';
		}





		window.requestAnimationFrame(function loopSiLoopSiLoop(){
			window.requestAnimationFrame(loopSiLoopSiLoop);
			loop();
		});
	}

	function loop() {
		plasmaBall.update();
		plasmaBall.draw(plasmaBall.context);
	}




	function init() {
		initCanvas();
	}

	init();


}());
