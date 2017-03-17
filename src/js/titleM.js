define(["jquery", "console", "modal", "cordova"], function($, console, modal, cordova) {
	console.log("TITLE M INIT");

	function hoverEvent(event){
		console.log("(titleM.js) hover Handler");
		var target = event.currentTarget.className.split(" ")[0];
		if(target == "titleMenu"){
			$("."+target).toggleClass("clickMenu");
		}
		else if(target == "run"){
			$("."+target).toggleClass("clickRun");
		}
		event.preventDefault();
	}

	$(document).ready(function() {
		if(cordova.isCordova()){
			$(".title .titleMenu").on("touchstart touchend",function(event){
				hoverEvent(event);
				var touchend = !$(event.currentTarget).hasClass("clickMenu");
				if(touchend){
					modal.openModal(".main");
				}
			});	
		}
	});
	return{
		hoverEvent: hoverEvent
	};
});