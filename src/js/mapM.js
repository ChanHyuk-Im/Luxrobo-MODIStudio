define(["jquery", "console", "cordova", "moduleboxM", "mapmoduleboxM"], function($, console, cordova, moduleboxM, mapmoduleboxM) {
	function showModulemapHandlerMobile() {
		console.log("(init.js)  with cordova");
		$(".map .modulemap").addClass("show");
		$(".map .liverot").removeClass("show");
		$(".map .tabModulemap").addClass("show");
		$(".map .tabLiverot").removeClass("show");
	}

	function showLiverotHandlerMobile() {
		console.log("(init.js)  with cordova");
		$(".map .modulemap").removeClass("show");
		$(".map .liverot").addClass("show");
		$(".map .tabModulemap").removeClass("show");
		$(".map .tabLiverot").addClass("show");
	}

	function toggleMap() {
		$(".title .mapBtn").on("touchstart touchend", function(event){
			console.log("(mapM.js)toggle map handler in mobile");
			$(this).toggleClass("clickMapBtn");
			
			if(event.type == "touchstart"){
				return;
			}
			else{
				event.preventDefault();
			}
			mapmoduleboxM.removeLongClickStyle();
			if($(".map").hasClass("lookMap")){
				$(".map").removeClass("lookMapModulebox");
				$(".map > .mapBody > .modulemap").removeClass("lookMapModulebox");
				$(".modulebox").removeClass("lookMapModulebox");
			}

			$(".modulebox > .tab").css("display", "none");

			$(".map").toggleClass("lookMap");
			$(".mapSetting").toggleClass("lookMapSetting");
			$(".modulebox").toggleClass("lookModulebox");
			$(".mobileBackground").toggleClass("showMobileBackground");
			$(".moduleboxBtn").toggleClass("showModuleboxBtn");
		});
	}

	function toggleMobileBackground() {
		$(".mobileBackground").on("click", function() {
			console.log("(mapM.js) toggleMobileBackground with cordova");
			
			if($(".tab > .hardware").hasClass("itemOnColor")){
				$(".tab > .hardware").removeClass("itemOnColor");
			}
			else{
				$(".tab > .custom").removeClass("itemOnColor");
			}

			$(".map").toggleClass("lookMap");
			$(".mapSetting").toggleClass("lookMapSetting");
			$(".modulebox").toggleClass("lookModulebox");
			$(".mobileBackground").toggleClass("showMobileBackground");
			$(".moduleboxBtn").toggleClass("showModuleboxBtn");
			moduleboxM.hideModulebox();

			$(".modulebox > .tab").css("display", "none");
		});
	}

	return {
		showModulemapHandlerMobile: showModulemapHandlerMobile,
		showLiverotHandlerMobile: showLiverotHandlerMobile,
		toggleMap: toggleMap,
		toggleMobileBackground: toggleMobileBackground
	};
});