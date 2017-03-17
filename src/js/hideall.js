define(["jquery", "console", "cordova", "mapmoduleboxM"], function($, console, cordova, mapmoduleboxM) {
	console.log("HIDEALL INIT");

	function hide(event) {
		console.log("(hideall.js)hide all");

		hideMenubox();

		var className = $(event.target).attr("class").split(" ")[0];
		if(cordova.isCordova()){
			// conditionbox의 title에서 goback버튼을 누른게 아니라면
			var targetName = $(event.target).attr("class").split(" ")[0];
			if(targetName !== "goback"){
				targetName = $(event.target).parent().attr("class");
				if(targetName === "title"){
					return;
				}
			}
		}
		if((className !== "boxHelp") && (className !== "boxList") && (className !== "boxWrapper") && (className !== "arr") && (className !== "textBox") && (className !== "colorSelect")) {
			hideConditionbox();
			
			if(cordova.isCordova()){
				if($(".list > .action").css("overflow") == "hidden"){
					$(".list > .action").css("overflow", "");
					$(".main > .menu").show();
				}
				mapmoduleboxM.removeLongClickStyle();
			}
			event.stopPropagation();
		}

		
	}

	function hideMenubox() {
		$(".main > .menubox > .projectBox").removeClass("show");
		$(".main > .menubox > .settingBox").removeClass("show");
		$(".main > .menubox > .helpBox").removeClass("show");
		
		$(".main > .menubox > .projectBoxArrow").removeClass("show");
		$(".main > .menubox > .settingBoxArrow").removeClass("show");
		$(".main > .menubox > .helpBoxArrow").removeClass("show");
	}

	function hideConditionbox() {
		$(".blockConditionBox").css("display", "none");

		$(".blockConditionBox .px").removeClass("textFocus");
		
		if(cordova.isCordova()){
			$(".list > .action").css("overflow", "");
			$(".main > .menu").show();
			$(".main > .body").css({
				"top": "44px",
				"height": $(".main").height()-$(".main > .title").outerHeight(true)-$(".menu").outerHeight(true)
			});
		}
	}

	return {
		hide: hide,
		hideMenubox: hideMenubox,
		hideConditionbox: hideConditionbox
	};
});