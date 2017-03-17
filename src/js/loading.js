define(["jquery", "console"], function($, console) {
	function setCenter() {
		// $(".main .loading .content").css({"top": $(".main .loading").height()/2 - $(".main .loading .gif").height()/2 -20, "left": $(".main .loading").width()/2 - $(".main .loading .gif").width()/2});
		$(".main .loading .text").css({
			"top": $(".main .loading").height()/2 +72-20 
		});
	}

	function start(object) {
		if(object.type == "system") {
			$(".main .loading").css({"width": "100%", "height": "100%"});
		}
		else if(object.type == "compile") {
			$(".main .loading").css({"width": "50%", "height": "50%"});
		}
		setCenter();
		$(".main .loading").css({"display": "block"});
	}

	function end() {
		$(".main .loading").css({"display": "none"});

		$(window).trigger("resize");
	}

	$(document).ready(function() {
		start({
			type: "system"
		});

		// window.setTimeout(end, 2000);
	});

	$(window).resize(function() {
		setCenter();
	});

	return {
		end: end
	};
});