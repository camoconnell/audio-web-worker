(function () {
  
    "use strict";

    var faderSrc = 'assets/js/fader.js';
	var audioSrc = 'assets/sound/rock_lobster.mp3';
	var imageSrc = 'assets/image/';
	var player, images;

	var preloadImgs = function(){
		var imageObj = new Image();
		images = [
			'animatedexercises.gif','animatedexercises_2.gif','animatedexercises_1.gif',
			'animatedexercises_3.gif','animatedexercises_4.gif','animatedexercises_5.gif','animatedexercises_6.gif'
		];
		for(var i=0; i<=(images.length-1); i++){
			imageObj.src = imageSrc + images[i];
		}
	};

	var setPlayer = function(){
		player = new Audio(audioSrc);
		player.fader = new Worker(faderSrc);
		player.faderPosition = 0.0;
		player.faderTargetVolume = 1.0;
		
		player.faderCallback = function(){};
		
		player.fadeTo = function(volume, func){
			if (func) {
				this.faderCallback = func;
			}
			this.faderTargetVolume = volume;
			this.fader.postMessage('start');
		};

		player.fader.addEventListener('message', function(e){
			if (player.faderTargetVolume > player.volume){
				player.faderPosition -= 0.02;
			} else {
				player.faderPosition += 0.02;
			}
			var newVolume = Math.pow(player.faderPosition - 1, 2);
			if (newVolume > 0.999){
				player.volume = newVolume = 1.0;
				player.fader.postMessage('stop');
				player.faderCallback();
			} else if (newVolume < 0.001) {
				player.volume = newVolume = 0.0;
				player.fader.postMessage('stop');
				player.faderCallback();
			} else {
				player.volume = newVolume;
			}
		});
	};

	var getRandom = function(min, max) {
		return Math.random() * (max - min) + min;
	};

	var setBg = function(){
		var body = document.getElementsByTagName('body')[0];
		var index = Math.round(getRandom(0,images.length-1));
		body.style.background = 'url(' + imageSrc + images[index] + ')';
	}

	var setVisibly = function(){
		visibly.onVisible(function(){
			player.fadeTo(1.0);
		});
		 
		visibly.onHidden(function(){
			player.fadeTo(0.0);
			setBg();
		});
    };

    var init = function(){
		preloadImgs();
		setPlayer();
		setVisibly();

		// go!
		player.addEventListener("loadeddata", function() {
			setBg();
			var div = document.getElementById("loading");
			div.parentNode.removeChild(div);
			player.play();
		}, true);
    };

    init();

})();