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


	var plasma = new LokPlasmaBall();


	function resize() {
		plasma.canvas.width = window.innerWidth;
		plasma.canvas.height = window.innerHeight;
	}

	function touchMove(e){

		var rect = plasma.canvas.getBoundingClientRect();

		var mx = e.touches[0].clientX - rect.left,
		my = e.touches[0].clientY - rect.top;

		plasma.mouse.x = mx;
		plasma.mouse.y = my;

		plasma.mouse.touch = e.touches;
		plasma.mouse.rect = rect;

		if (plasma.withinPlamsaBall()){
			e.preventDefault();
		}else{
			plasma.mouse.down = false;
		}

		//		console.log(e);

		return false;
	}

	function mouseMove(e) {
		var rect = plasma.canvas.getBoundingClientRect();

		var mx = e.clientX - rect.left,
		my = e.clientY - rect.top;

		plasma.mouse.x = mx;
		plasma.mouse.y = my;

	}

	function mouseDown(e) {
		plasma.mouse.down = true;
		document.body.style.cursor = 'pointer';
	}

	function mouseUp(e) {
		plasma.mouse.down = false;
		document.body.style.cursor = 'default';
	}

	function listenToEvents(){
		window.addEventListener('resize', window.debounce(resize, 100, true) );

		plasma.canvas.addEventListener('mousemove', mouseMove, false);
		plasma.canvas.addEventListener('mousedown', mouseDown, false);
		plasma.canvas.addEventListener('mouseup', mouseUp, false);

		plasma.canvas.addEventListener('touchmove', touchMove, false);
		plasma.canvas.addEventListener('touchstart', mouseDown, false);

		plasma.canvas.addEventListener('touchend', mouseUp, false);
		plasma.canvas.addEventListener('touchcancel', mouseUp, false);
		plasma.canvas.addEventListener('touchleave', mouseUp, false);

	}


	function startLoop(){
		window.requestAnimationFrame(function loopSiLoopSiLoop(){
			window.requestAnimationFrame(loopSiLoopSiLoop);
			loop();
		});
	}

	function loop() {
		plasma.update();
		plasma.draw(plasma.context);
	}


	function init() {

		plasma.init();

		listenToEvents();

		document.getElementById('lokPlasmaBall').appendChild(plasma.canvas);
		startLoop();


	}

	init();


}());
