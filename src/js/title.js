define(["jquery", "console", "menubox", "modal", "electron", "titleM", "cordova", "community"], function($, console, menubox, modal, electron, titleM, cordova, community) {
	console.log("TITLE INIT", "title.js");
	var guiState = 1;
	var totalActionCode = "";
	var enableUploadFlag = false;
	var playState = true;

	function logoLandingViewHandler(event) {
		console.log("(title.js)logo landing view handler");
		var hideall = require('hideall');
		hideall.hideMenubox();

		modal.openModal(".main");
		event.stopPropagation();
	}

	function codeConvertHandler(event) {
		console.log("(title.js)code convert handler");
		
		var cui = require('cui');

		if(guiState === 0) {
			if(electron.isElectron()){
				toggleHover($(".guicui"), $(".guicui > .cui"));
			} else if(cordova.isCordova()){
				$(".imageGuicui").css({"background": "url('./image_mobile/etc/gui.svg') no-repeat"});
				if(event.type == 'touchstart'){
					$(".imageGuicui").css({"background": "url('./image_mobile/etc/cuiOn.svg') no-repeat"});
					return;
				}
				else if(event.type == 'touchend'){
					$(".imageGuicui").css({"background": "url('./image_mobile/etc/gui.svg') no-repeat"});
					event.preventDefault();
				}
			}
			
			guiState = 1;

			// $(".guicui").trigger("mouseenter");
			console.log(".cui display none");
			// action 내에 존재하는 gui, cui를 토글하며 display:none; 시켜줌.
			$(".editor .cui").css({"display": "none"});
			$(".editor .gui").css({"display": "block"});

			// $(document).trigger("resize");

		}else if(guiState === 1) {
			if(electron.isElectron()){
				toggleHover($(".guicui"), $(".guicui > .gui"));
			} else if(cordova.isCordova()){
				$(".imageGuicui").css({"background": "url('./image_mobile/etc/cui.svg') no-repeat"});
				if(event.type == 'touchstart'){
					$(".imageGuicui").css({"background": "url('./image_mobile/etc/guiOn.svg') no-repeat"});
					return;
				}
				else if(event.type == 'touchend'){
					$(".imageGuicui").css({"background": "url('./image_mobile/etc/cui.svg') no-repeat"});
					event.preventDefault();
				}
			}
			
			guiState = 0;

			var actionName = $(".main .editor .action:not(.off)").attr("id");
			cui.createAceAction();
			cui.setTextCurrentAction( getActionCode() );

			// $(".guicui").trigger("mouseenter");
			console.log(".gui display none");
			// action 내에 존재하는 gui, cui를 토글하며 display:none; 시켜줌.
			$(".editor .gui").css({"display": "none"});
			$(".editor .cui").css({"display": "block"});
			
		}

		cui.setAceSize();
//		event.stopPropagation();
	}


	function resetHandler(event) {
		console.log("(mapsetting.js)reload handler");

		var hideall = require('hideall');
		hideall.hideMenubox();

		var modal = require('modal');
		modal.openModal(".modulereset");

		event.stopPropagation();
	}

	function uploadHandler(event) {
		console.log("(title.js) upload handler");
		if(cordova.isCordova()){
			titleM.hoverEvent(event);
			if(event.type == 'touchstart'){
				return;
			}
			event.preventDefault();
		}
		console.log(gui2Code());

		var hideall = require('hideall');
		hideall.hideMenubox();
		
		if (enableUploadFlag){
			modal.openModal(".upload");
			// enableUploadFlag = false;
		}
		event.stopPropagation();
	}

	function enableUpload(bool){
		enableUploadFlag = bool;
	}

	function genResetCode(){
		var mainCode = "";

		mainCode += "int main() {\r\n";
		$(".map .modulemap .module.con").each(function(itr) {		// UUID 할당
			if ( !$(this).hasClass("usb") ){
				mainCode += "\t" + capitalizeFirstLetter($(this).data("type"));
				mainCode += " " + $(this).data("name");
				mainCode += "(" + $(this).data("uuid") + ");\r\n";
			}
		});

		mainCode += "\r\n";

		var modules = $(".map .modulemap > .module");
		var itrModule;
		for(itrModule = 0; itrModule < modules.length; itrModule++) {
			if ($(modules[itrModule]).hasClass("usb") ){
				continue;
			}

			mainCode += "\t";
			mainCode += $(modules[itrModule]).data("name");
			mainCode += ".add(___NOP);\r\n";
		}

		mainCode += "}";

		return mainCode;
	}

	function genOsUpdateList() {
		var list = [];

		$(".map .modulemap .module").each(function(itr) {
			if ( !$(this).hasClass("usb") ) {
				list.push({
					type: capitalizeFirstLetter($(this).data("type")),
					uuid: $(this).data("UUID")
				});
			}
		});

		return list;
	}

	/**
		gui로 coding한 내용을 cui source code로 변환해주는 function
	*/
	function gui2Code() {
		totalCode = "";

		totalCode += getGlobalVariableCode();
		totalCode += getActionCode();
		totalCode += getMainCode();

		return totalCode;
	}

	function getGlobalVariableCode() {
		var variableCode = "";

		$(".map .module.number, .map .module.random").each(function(itr) {
			variableCode += "int ";
			variableCode += $(this).attr("id");
			variableCode += ";\r\n";
		});
		variableCode += "\r\n";

		return variableCode;
	}

	// function getTotalActionCode() {
	// 	var totalActionCode = "";

	// 	$(".editor > .body > .list > .action").each(function(itr) {
	// 		var actionName = $(this).attr("id");

	// 		totalActionCode += "void newAction() {\r\n";
	// 		totalActionCode += getActionCode();
	// 		totalActionCode += "}\r\n";
	// 	});

	// 	return totalActionCode;
	// }

	function getActionCode() {
		var actionCode = "";
		var code = "";

		actionCode += "void newAction()\r\n{\r\n";
		code = $(".editor > .body > .list > .action").nestable("serialize");
		code = codelize(code, "\t");
		actionCode += code;
		actionCode += "}\r\n";

		return actionCode;
	}

	function getMainCode() {
		var mainCode = "";
		var moduleArr = {};
		var modules = $(".map .modulemap .module.con");
		var itrModule;

		mainCode += "int main()\r\n{\r\n";
		// $(".map .modulemap .module:not(.number):not(.random):not(.discon)").each(function(itr) {
		$(".map .modulemap .module.con").each(function(itr) {
		// UUID 할당
			if($(this).hasClass("usb")) {
				mainCode += "\tNetwork";
			} else {
				mainCode += "\t" + capitalizeFirstLetter($(this).data("type"));	
			}
			mainCode += " " + $(this).data("name");
			mainCode += "(" + $(this).data("uuid") + ");\r\n";
		});

		mainCode += "\r\n";

		$(".editor > .body > .list > .action").each(function(itr) {
			var blocks = $(this).find(".block");
			var itrBlock;

			for(itrBlock = 0; itrBlock < blocks.length; itrBlock++) {
				// var modules = $(".map .modulemap .module:not(.number):not(.random):not(.discon)");
				for(itrModule = 0; itrModule < modules.length; itrModule++) {
					if($(blocks[itrBlock]).parent().data("code") !== undefined) {
						if($(blocks[itrBlock]).parent().data("code").indexOf($(modules[itrModule]).data("name")) != -1) {
							if($(modules[itrModule]).data("subtitle") !== "network") {
								moduleArr[itrModule] = true;
								mainCode += "\t";
								mainCode += $(modules[itrModule]).data("name");
								mainCode += ".add(";
								mainCode += "newAction";
								mainCode += ");\r\n";
								return true;
							}
						}
					}
				}
			}
		});

		// var modules = $(".map .modulemap .module:not(.number):not(.random):not(.discon)");
		for(itrModule = 0; itrModule < modules.length; itrModule++) {
			if (moduleArr[itrModule] === true || $(modules[itrModule]).data("subtitle") == "network"){
				continue;
			}

			mainCode += "\t";
			mainCode += $(modules[itrModule]).data("name");
			mainCode += ".add(___NOP);\r\n";
		}

		mainCode += "}";

		return mainCode;
	}

	function codelize( arr, tab ){
		if ( tab === undefined ) {
			tab = "";
		}
		luxc = "";
		// inArr = arr[1];

		arr.forEach(function(item, index){
			// if(item.annotation === true) {
			// 	return;
			// }
			if(item.code !== undefined) {
				if(item.annotation === true) {
					if(item.logic == "display") {
						for(var j = 0; j < 49; j++) {
							luxc += "// ";
							luxc += tab + item.code.split("\r\n")[j] + "\r\n";
						}
					} else {
						luxc += "// ";
						luxc += tab + item.code + "\r\n";
					}
				} else {
					luxc += tab + item.code + "\r\n";
				}
			}
			var logic = ['if', 'while', 'loop'];
			if(logic.includes(item.logic)) {
				if(item.annotation === true) {
					luxc += "// ";
				}
				luxc += tab + '{\r\n';
				if ( item.children !== undefined ) {
					if(item.logic == "display") {
						for(var j = 1; j < 49; j++) {
							luxc += tab+"\t";
							luxc += "// ";
							luxc += item.code.split("\r\n")[j];
						}
					} else {
						luxc += codelize( item.children, tab+"\t" );
					}
				}
				if(item.annotation === true) {
					luxc += "// ";
				}
				luxc += tab + '}\r\n';
			}
		});

		return luxc;
	}

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function getGuiState() {
		return guiState;
	}

	function setGuiState(state) {
		guiState = state;
	}

	function togglePlayPause(event) {
		console.log("(title.js)toggle play and pause");

		if(playState) {
			toggleHover($(".playpause"), $(".playpause > .play"));
		} else {
			toggleHover($(".playpause"), $(".playpause > .pause"));
		}

		playState = !playState;
		$(".playpause").trigger("mouseenter");
	}

	function toggleHover(target, thisDiv) {
		var notThisDiv = $(target).find("> div").not($(thisDiv));

		$(thisDiv).css({"display": "none"});
		$(notThisDiv).css({"display": "initial"});
	}

	function setHover() {
		if(electron.isElectron()){
			toggleHover($(".guicui"), $(".guicui > .cui"));
			toggleHover($(".playpause"), $(".playpause > .pause"));
		}
	}

	function setBatteryRemains(remains) {
		$(".title .battery .remains").text(remains);
	}

	function shortcutHandler(event) {
		// if ((event.metaKey || event.ctrlKey) && (String.fromCharCode(event.which).toLowerCase() === 'c')) {
		// 	console.log("You pressed CTRL + C", "main.js");		// copy
		// }
		if(event.key === "F5") {
			uploadHandler(event);
		}
		else if(event.key === "F6") {
			resetHandler(event);
		}
		else if(event.key === "F8") {
			codeConvertHandler(event);
		}
	}

	$(document).ready(function() {
		$(".title .titleLogo").on("click", logoLandingViewHandler);
		$(".title .reset").on("click", resetHandler);
		$(".title .upload").on("click touchstart touchend", uploadHandler);
		$(".title .guicui").on("click touchstart touchend", codeConvertHandler);
		$(document).on('keydown', shortcutHandler);
		$(".title .playpause").on("click", togglePlayPause);

		setHover();
	});

	return {
		gui2Code: gui2Code,
		enableUpload: enableUpload,
		genResetCode: genResetCode,
		genOsUpdateList: genOsUpdateList,
		getGuiState: getGuiState,
		setGuiState: setGuiState,
		setBatteryRemains: setBatteryRemains
	};
});