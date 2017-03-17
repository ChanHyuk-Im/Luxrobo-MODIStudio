define(["jquery", "console", "cordova", "mapmoduleboxM"], function($, console, cordova, mapmoduleboxM) {
	function showHardwareHandlerMobile() {
		console.log("(moduleboxM.js) showHardwareHandlerMobile with cordova");

		toggleShowModulebox();
		$(".map").addClass("showModuleboxMap");
	}

	function showCustomHandlerMobile() {
		console.log("with cordova");

		toggleShowModulebox();
		$(".map").addClass("showModuleboxMap");
	}

	function showModulesetHandlerMobile() {
		console.log("with cordova");

		toggleShowModulebox();
		$(".map").addClass("showModuleboxMap");
	}


	/**
		모듈 박스가 위로 커질 때 map의 높이가 줄어들도록
		모듈 박스가 tab만 남기고 작아질 때 map의 높이가 늘어나도록
	*/
	function toggleShowModulebox() {
		console.log("(modueleboxM.js) toggle height of map");

		mapmoduleboxM.removeLongClickStyle();

		if($(".map").hasClass("showModuleboxMap")) {			
			$(".map").css({
				height: $(".main").outerHeight(true) - 54,
			});
			$(".map > .mapBody > .modulemap").css({
				height: $(".main").outerHeight(true) - 54,
			});
			
			$(".modulebox").css({ height: 54 });

			if($(".tab > .hardware").hasClass("itemOnColor")){
				$(".tab > .hardware").removeClass("itemOnColor");
			}
			else{
				$(".tab > .custom").removeClass("itemOnColor");
			}
			
			console.log("hasClass showmoduleboxmap");
		}
		else {
			$(".map").css({
				height: $(".main").outerHeight(true) - 349
			});
			$(".map > .mapBody > .modulemap").css({
				height: $(".main").outerHeight(true) - 349
			});

			if($(".map").hasClass("lookMap")){
				$(".modulebox").css({ height: 349 });
			}

			if($(".hardwareBody").hasClass("noneDisplayModuleboxBody")){
				$(".tab > .custom").addClass("itemOnColor");
				$(".tab > .hardware").removeClass("itemOnColor");
			}
			else{
				$(".tab > .hardware").addClass("itemOnColor");
				$(".tab > .custom").removeClass("itemOnColor");
			}
			console.log("!hasClass showmoduleboxmap");
		}
	}

	function showModulebox() {
		$(".modulebox > .body").addClass("lookModuleboxBody");
		$(".modulebox").addClass("showModulebox");
		$(".imgModulebox").addClass("showImgModulebox");

		$(".map").css({
			height: $(".main").outerHeight(true) - 349
		});
		$(".map > .mapBody > .modulemap").css({
			height: $(".main").outerHeight(true) - 349
		});
		$(".modulebox").css({
			height: 349
		});

		$(".map").addClass("showModuleboxMap");
	}

	function hideModulebox() {
		$(".map").removeClass("lookMapModulebox");
		$(".map > .mapBody > .modulemap").removeClass("lookMapModulebox");
		$(".modulebox").removeClass("lookMapModulebox");

		$(".modulebox > .body").removeClass("lookModuleboxBody");
		$(".modulebox").removeClass("showModulebox");
		$(".imgModulebox").removeClass("showImgModulebox");

		$(".map").css({
			height: $(".main").outerHeight(true) - 54,
		});
		$(".map > .mapBody > .modulemap").css({
			height: $(".main").outerHeight(true) - 54,
		});
		$(".modulebox").css({
			height: 54
		});

		if($(".tab > .hardware").hasClass("itemOnColor")){
			$(".tab > .hardware").removeClass("itemOnColor");
		}
		else{
			$(".tab > .custom").removeClass("itemOnColor");
		}
			
		$(".map").removeClass("showModuleboxMap");
	}

	function toggleModulebox(){
		console.log("(moduleboxM.js)toggle modulebox handler in mobile");

		if($(".map").hasClass("lookMap")){
			$(".map").addClass("lookMapModulebox");
			$(".map > .mapBody > .modulemap").addClass("lookMapModulebox");
			$(".modulebox").addClass("lookMapModulebox");
		}
		
		$(".modulebox > .body").toggleClass("lookModuleboxBody");
		$(".modulebox").toggleClass("showModulebox");
		$(".imgModulebox").toggleClass("showImgModulebox");

		toggleShowModulebox();
		$(".map").toggleClass("showModuleboxMap");
	}

	function inDocumentReady() {
		console.log("with cordova");

		$(".map").on("click", function(){
			if($(".modulebox").hasClass("showModulebox")){
				toggleModulebox();
				$(".modulebox > .tab").css("display", "none");
			}
		});

		$(".modulebox .hardwareBody > div > .text").on("click", function() {
			$(this).parent().toggleClass("moduleboxModuleset");
			$(this).parent().find(".hardwareArrow").toggleClass("moduleboxModulesetArrow");
		});
		$(".modulebox .modulesetGroup > .name").on("click", function() {
			$(this).parent().toggleClass("moduleboxModuleset");
			$(this).find(".modulesetArrow").toggleClass("moduleboxModulesetArrow");
		});

		$(".moduleboxBtn").on("touchstart touchend", function(event) {
			hoverEvent(event);
			if(event.type == "touchend"){				
				toggleModulebox();
				if($(".modulebox").css("height") === "54px"){
					$(".modulebox > .tab").css("display", "block");
				}
				else{
					$(".modulebox > .tab").css("display", "none");
				}
			}
		});

		$(".modulebox > .tab > .hardware").on("click", function() {
			console.log("(moduleboxM.js) show modulebox hardware in cordova");
			showModulebox(); 
		});

		$(".modulebox > .tab > .custom").on("click", function() {
			console.log("(moduleboxM.js) show modulebox custom in cordova");
			showModulebox();
		});

		$(".modulebox > .tab > .moduleset").on("click", function() {
			console.log("(moduleboxM.js) show modulebox moduleset in cordova");
			showModulebox();
		});
	}

	function setModuleBoxTab() {
		var width = $(".modulebox").width()-108;
		$(".main > .modulebox > .tab").css({"width": width});
	}

	function hoverEvent(event){
		console.log("(moduleboxM.js) hover Event");
		var target = event.currentTarget.className.split(" ")[0];
		if(target == "imgModulebox"){
			$("."+target).toggleClass("clickImgModulebox");
		}
		else if(target == "moduleboxBtn"){
			if($("."+target).hasClass("showModuleboxBtn")){
				$("."+target).toggleClass("clickModuleboxBtn");
			}
		}
		event.stopPropagation();
	}

	return {
		toggleModulebox: toggleModulebox,
		setModuleBoxTab: setModuleBoxTab,
		showHardwareHandlerMobile: showHardwareHandlerMobile, 
		showCustomHandlerMobile: showCustomHandlerMobile, 
		showModulesetHandlerMobile: showModulesetHandlerMobile,
		toggleShowModulebox: toggleShowModulebox,
		showModulebox: showModulebox,
		inDocumentReady: inDocumentReady,
		hideModulebox: hideModulebox,
		hoverEvent: hoverEvent
	};
});