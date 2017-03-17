define(["jquery", "console", "cordova"], function($, console, cordova) {
	function closeBeforeopenproject() {
		console.log("(modalM.js) with cordova");

		var prevState = ".main";

		$(".modal").on("click", "> .beforeOpenproject .cancel", function() {
			console.log("(modalM.js)close modal handler");		
			$(".modal").css({"display": "none"});
			prevState = "";
		});
	}

	function toggleButtonDetail() {
		console.log("(init.js) toggle buttonDetail in mobile");

		var detail = $(".run > .body > .update > .buttonDetail");
		var runDiv = $(".run > .body > .update > .buttonDetail").parents(".run");
			
		if(detail.hasClass("show")) {
			console.log("hasClass show");
			$(".modal > .window > .body").css({"border": "0px"});
			$(".modal > .run > .body > .update").css({"border": "0px"});
			$(".modal > .window > .title").css({
				"color": "rgb(0, 0, 0)",
			    "background": "rgb(250, 250, 250)",
			    "border-bottom": "1px solid rgb(188, 188, 188)"
			});

			runDiv.animate({
				"width": $(".main").width(),
				"height": $(".main").height(),
				"left": 0,
				"top": 0
			}, 450);
			runDiv.find(".body").animate({
				"width": $(".main").width(),
				"height": $(".main").height() - 38
			}, 450);
			runDiv.find(".update").animate({
				"width": $(".main").width(),
				"height": $(".main").height() - 38
			}, 450);
			runDiv.find(".textDetail").animate({
				"width": $(".main").width() - 16,
				"height": $(".main").height() - 122,
				"left": 8,
				"top": 16,
			    "padding": "0px",
			    "color": "rgb(0, 0, 0)",
			    "background-color": "rgb(255, 255, 255)"
			}, 450);
			runDiv.find(".buttonDetail").animate({
				"width": "72.26%",
				"left": "13.86%"
			}, 450);
			runDiv.find(".buttonDetail").text("Hide details");
			detail.removeClass("show");
		} else {
			console.log("not hasClass show");
			$(".modal > .window > .body").css({
			    "border-right": "1px solid rgb(88, 88, 88)",
			    "border-bottom": "1px solid rgb(88, 88, 88)",
			    "border-left": "1px solid rgb(88, 88, 88)"
			});
			$(".modal > .run > .body > .update").css({
				"border-bottom": "1px solid rgb(88, 88, 88)"
			});
			$(".modal > .window > .title").css({
				"color": "rgb(255, 255, 255)",
			    "background": "rgb(65, 65, 65)",
		        "border-bottom": "0px"
			});

			runDiv.animate({
				width: 327,
				height: 416,
				left: ($("body").width() - 327) / 2,
				top: ($("body").height() - 416) / 3
			}, 450);
			runDiv.find(".body").animate({
				width: "100%",
				height: 379
			}, 450);
			runDiv.find(".update").animate({
				width: "100%",
				height: 379
			}, 450);
			runDiv.find(".textDetail").animate({
				width: 303,
				height: 100,
				left: 12,
				top: 182,
				color: 'rgb(140, 140, 140)',
			    'padding-top': 16,
			    'padding-left': 8,
			    'padding-right': 8,
				'background-color': 'rgb(241, 241, 241)'
			}, 450);
			runDiv.find(".buttonDetail").animate({
				width: 147,
				left: 90
			}, 450);
			runDiv.find(".buttonDetail").text("Show details");
			detail.addClass("show");
		}
	}

	function setModalCenterMobile(modalSelector) {
		var centerX = ($("body").width() - $(".modal " + modalSelector).width()) / 2;
		var centerY = ($("body").height() - $(".modal " + modalSelector).height()) / 2;

		$(".modal " + modalSelector).css({"left": centerX, "top": centerY});
	}

	function showRunUpdateResultMobile(icon, Color, textResult, text) {
		console.log("(modal.js) show Run Update Result in pc");
		
		$(".modal > .run").css({"height": "348px"});
		$(".modal > .run > .body").css({"height": "310px"});
		$(".modal > .run > .body > .update").css({"height": "310px"});

		$(".modal > .run .update > .gif").css({"display": "none"});
		$(".modal > .run .update > .textUpdate").text(textResult);
		$(".modal > .run .update > .textUpdate").css({
			"top": "76px",
			"color": Color
		});
		$(".modal > .run .update > .icon").css({
			"display": "initial",
			"background": "url('../image_mobile/modal/"+icon+".svg') no-repeat"
		});
		$(".modal > .run .update > .textWarning > span").text(text);
		$(".modal > .run .update > .textWarning").css({
			"top": "102px",
			"font-size": "14px"
		});
		$(".modal > .run .update > .textDetail").css({
			"top": "131px"
		});

		$(".modal > .run .update > .buttonDetail").css({
			"display": "none"
		});
		$(".modal > .run .update > .close").css({
			"display": "initial"
		});
	}

	function showRunDuringUpdateMobile() {
		$(".modal > .run").css({"height": "399px"});
		$(".modal > .run > .body").css({"height": "361px"});
		$(".modal > .run .update > .gif").css({"display": "initial"});
		$(".modal > .run .update > .textUpdate").text("Update in progress..");
		$(".modal > .run .update > .textUpdate").css({
			"top": "124px",
			"color": "rgb(0, 0, 0)"
		});

		$(".modal > .run .update > .icon").css({
			"display": "none"
		});
		$(".modal > .run .update > .textWarning > span").text("DO NOT disconnect module while firmware update is in progress, damage may occur.");
		$(".modal > .run .update > .textWarning").css({
			"top": "154px"
		});
		$(".modal > .run .update > .textDetail").css({
			"top": "202px"
		});

		$(".modal > .run .update > .buttonDetail").css({
			"display": "initial"
		});
		$(".modal > .run .update > .close").css({
			"display": "none"
		});

		var centerX = ($("body").width() - $(".modal > .run").width()) / 2;
		var centerY = ($("body").height() - $(".modal > .run").height()) / 2;
		$(".modal > .run").css({"left": centerX, "top": centerY});
		$(".run > .body > .update > .buttonDetail").addClass("show"); // update창에 button클래스를 항상 보이는 상태로 유지하는 예외 
	}

	function setClickNewproject() {
		$(".modal > .newproject > .body > .file > ul > .item").on("click", function() {
			$(this).toggleClass("click");
			$(".modal > .newproject > .body > .file > ul > .item > .name").toggleClass("clickText");
		});
	}

	function hoverEvent(event){
		console.log("(modalM.js) hover Handler");
		if(cordova.isCordova()){
			var target = event.currentTarget.className.split(" ")[0];
	        if(target == "logout"){
	        	$("."+target).toggleClass("clickLogout");
	        }
	        else if(target == "open"){
	        	$("."+target).toggleClass("clickOpen");
	        }
	        else if(target == "button"){
	        	$("."+target).toggleClass("clickBotton");
	        }
	        else{
		        $("."+target).toggleClass("hoverEffect");
	        }
		}
		event.preventDefault();
	}

	function clearUpdateTextMobile() {
		$(".modal .run .update .textDetail").text("");
	}

	function closeModalMobile(event) {
		// console.log(event); 
		// $(event.currentTarget).parents(".window").remove();

		$(".modal").css({"display": "none"});
		prevState = "";
	}

	function closeRunMobile() {
		clearUpdateTextMobile();
		showRunDuringUpdateMobile();
		$(".modal .run").css({"height": "240px"});
		$(".modal .run .body").css({"height": "200px"});
	}

	function resetHandler(event) {
		console.log("(mapsetting.js)reload handler");

		hoverEvent(event);
		if(event.type == "touchstart"){
			return;
		}

		var modal = require('modal');
		modal.openModal(".modulereset");

		event.stopPropagation();
	}

	var checked=false;
	$(document).on("ready", function(){
		if(cordova.isCordova()){
			$(".loading").hide();
			$(".modal").on("touchstart touchend", "> div .community", hoverEvent);
			$(".modal").on("touchstart touchend", "> div .logout", hoverEvent);	
			$(".modal").on("touchstart touchend", "> div .save", hoverEvent);	
			$(".modal").on("touchstart touchend", "> div .reset", resetHandler);	
			$(".modal").on("touchstart touchend", "> div .setting", hoverEvent);
			$(".modal").on("click", "> div .switchBtn", function(){
				if(checked){
		        	checked=false;
					$(".switch").removeClass("checked");
					$(".bluetooth > .switchBtn").stop().animate({"backgroundColor": "#bcbcbc"}, 380);
				}
		        else{
		        	checked=true;
					$(".switch").addClass("checked");
					$(".bluetooth > .switchBtn").stop().animate({"backgroundColor": "rgb(38,202,211)"}, 380);
		        }  
			});
		}
	});
	return {
		closeBeforeopenproject: closeBeforeopenproject,
		toggleButtonDetail: toggleButtonDetail,
		setModalCenterMobile: setModalCenterMobile,
		showRunUpdateResultMobile: showRunUpdateResultMobile,
		showRunDuringUpdateMobile: showRunDuringUpdateMobile,
		hoverEvent: hoverEvent
	};
});