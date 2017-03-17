define(["jquery", "console", "action"], function($, console, action) {
	console.log("PROJECT INIT");

	function init() {
		var editor = require('editor');
		close();
		action.newActionHandler(undefined);

		editor.setNestable();
		editor.setNestable();		// setNestable을 한번만 call하면 가끔 placeholder가 생기지 않음.
	}

	function close() {
		var guiblock = require('guiblock');
		var mapmodule = require('mapmodule');
		// $(".dd").nestable("destroy");

		$(".editor > .body > .list").empty();

		$(".map .modulemap").empty();

		guiblock.initArr();
		mapmodule.initModuleCount();
	}

	function save() {
		//////////////////////////////////////// serialize
		// var serial = {
		// 	editor: editor.serialize(),
		// 	plumb: plumb.serialize()
		// };

		// return JSON.stringify(serial);
		////////////////////////////////////////
		var title = require('title');
		var guiblock = require('guiblock');
		var plumb = require('plumb');
		var mapmodule = require('mapmodule');

		var data = {
			editor: "",		// editor's HTML code
			map: "",			// map's HTML code
			projectName: "",		// project name
			guiIcon: "",			// gui&cui icon HTML code
			guiState: 1,		// gui&cui guiState (1: gui, 0: cui)
			arrPickedColor: [],	//arrPickedColor
			arrWhat: [],		// arrWhat
			arrInput: [],		// arrInput
			arrOutput: [],	// arrOutput
			arrNetwork: [],	// arrNetwork
			arrNumber: [],	// arrNumber
			arrRandom: [],	// arrRandom
			// drawingboardData: [],	//drawingboard's html data in boxhelp("drawing")
			moduleData: [],		// module's data (UUID, TYPE, TITLE ...)
			moduleCount: {},	// count for each type of module
			connData: {}		// each module's connections data {srcID: dstID ...}
		};

		data.editor = $(".editor .body .list").html();
		data.map = $(".map .modulemap").html();
		data.projectName = $(".title .titleName").text();
		data.guiIcon = $(".title .guicui").html();
		data.guiState = title.getGuiState();
		data.arrPickedColor = guiblock.getArrPickedColor();
		data.arrWhat = guiblock.getArrWhat();
		data.arrInput = guiblock.getArrInput();
		data.arrOutput = guiblock.getArrOutput();
		data.arrNetwork = guiblock.getArrNetwork();
		data.arrNumber = guiblock.getArrNumber();
		data.arrRandom = guiblock.getArrRandom();
		$(".map .module").each(function(itr) {
			var moduleData = $(this).data();
			moduleData["ui-draggable"] = "";
			data.moduleData.push(moduleData);
		});
		data.moduleCount = mapmodule.getModuleCount();
		data.connData = plumb.getAllConnectionsData(plumb.mapInstance);

		return JSON.stringify(data);
	}

	function open(json) {
		var data = JSON.parse(json);
		var i = 0;
		var mapmodule = require('mapmodule');
		var init = require('init');
		var title = require('title');
		var editor = require('editor');
		var guiblock = require('guiblock');
		var plumb = require('plumb');
		var builder = require('builder');
		var daemon = require('daemon');

		$(".title .titleName").text(data.projectName);
		$(".map .modulemap").html(data.map);
		plumb.detachAllConnections(plumb.mapInstance);
		$(".jsplumb-endpoint, .jsplumb-connector").remove();
		$(".editor .body .list").html(data.editor);
		$(".title .guicui").html(data.guiIcon);
		title.setGuiState(data.guiState);
		guiblock.setArrPickedColor(data.arrPickedColor);
		guiblock.setArrWhat(data.arrWhat);
		guiblock.setArrInput(data.arrInput);
		guiblock.setArrOutput(data.arrOutput);
		guiblock.setArrNetwork(data.arrNetwork);
		guiblock.setArrNumber(data.arrNumber);
		guiblock.setArrRandom(data.arrRandom);
		if(data.moduleData) {
			for(i = 0; i < data.moduleData.length; i++) {
				$(".map .module").each(function(itr) {
					if(data.moduleData[i].name == $(this).find(".image").attr("id").split("Image")[0]){
						$(this).data(data.moduleData[i]);
						return false;
					}
				});
			}
		}
		mapmodule.setModuleCount(data.moduleCount);
		plumb.connAllConnections(plumb.mapInstance, data.connData);

		init.setDiv(65);

		editor.setNestable();

		if(data.guiState === 0) {
			$(".title .guicui").trigger("click");
			$(".title .guicui").trigger("click");
		}

		setInput($(".editor li.dd-item"));
		setPlumbColor($(".editor li.dd-item"));
		setTimeout(function() {
			// builder.requestNetworkTopology();
			daemon.requestNetworkTopology($($(".main .map .module")[0]).data("from"));
			setTimeout(function() {
				// builder.rebootAllModules();
				daemon.restartAllModules($($(".main .map .module")[0]).data("from"));
			}, 100);
		}, 500);
	}

	function setInput(ddItem) {
		var guiblock = require('guiblock');

		for(i = 0; i < ddItem.length; i++) {
			var dataLogic = $(ddItem[i]).attr("data-logic");
			var blockConditionbox = $(ddItem[i]).find(".blockConditionBox");
			
			if(dataLogic == "if" || dataLogic == "while") {
				var boxWrapper;
				var arr1;
				var arr2;
				var arr3;

				for(var j = 0; j < blockConditionbox.find(".boxWrapper").length; j++) {
					boxWrapper = $(blockConditionbox.find(".boxWrapper")[j]);
					arr1 = $(blockConditionbox.find(".arr1")[j]);
					arr2 = $(blockConditionbox.find(".arr2")[j]);
					arr3 = $(blockConditionbox.find(".arr3")[j]);

					arr1.find("input").val(blockConditionbox.attr("data-save-what").split(",")[j]);
					boxWrapper.attr("data-arr1", arr1.find("input").val().split(".")[0]);
					boxWrapper.attr("data-arr1_1", arr1.find("input").val().split(".")[1]);

					arr2.find("input").val(blockConditionbox.attr("data-save-arr2").split(",")[j]);
					boxWrapper.attr("data-arr2", arr2.find("input").val());
					
					arr3.find("input").val(blockConditionbox.attr("data-save-data").split(",")[j]);
					boxWrapper.attr("data-arr3", arr3.find("input").val().split(".")[0]);
					boxWrapper.attr("data-arr3_1", arr3.find("input").val().split(".")[1]);
				}
			} else if(dataLogic == "loop") {
				blockConditionbox.find(".loopAndDelayArr1 input").val(blockConditionbox.attr("data-save-num"));
				blockConditionbox.attr("data-num", blockConditionbox.attr("data-save-num"));
			} else if(dataLogic == "math") {
				blockConditionbox.find(".mathBoxVariable input").val(blockConditionbox.attr("data-save-variable"));
				blockConditionbox.attr("data-variable", blockConditionbox.attr("data-save-variable"));

				blockConditionbox.find(".formular input").val(blockConditionbox.attr("data-save-formular"));
				blockConditionbox.attr("data-formular", blockConditionbox.attr("data-save-formular"));
			} else if(dataLogic == "delay") {
				blockConditionbox.find(".loopAndDelayArr1 input").val(blockConditionbox.attr("data-save-num"));
				blockConditionbox.attr("data-num", blockConditionbox.attr("data-save-num"));
			} else if(dataLogic == "number") {
				blockConditionbox.find(".numberArr1 input").val(blockConditionbox.attr("data-save-number"));
				blockConditionbox.attr("data-number", blockConditionbox.attr("data-save-number"));
			} else if(dataLogic == "random") {
				blockConditionbox.find(".randomMin input").val(blockConditionbox.attr("data-save-min"));
				blockConditionbox.find(".randomMax input").val(blockConditionbox.attr("data-save-max"));
			} else if(dataLogic == "motor") {
				blockConditionbox.find(".property input").val(blockConditionbox.attr("data-save-property"));
				blockConditionbox.attr("data-property", blockConditionbox.attr("data-save-property"));

				blockConditionbox.find(".upper input").val(blockConditionbox.attr("data-save-upper"));
				blockConditionbox.attr("data-upper", blockConditionbox.attr("data-save-upper"));

				blockConditionbox.find(".bottom input").val(blockConditionbox.attr("data-save-bottom"));
				blockConditionbox.attr("data-bottom", blockConditionbox.attr("data-save-bottom"));
			} else if(dataLogic == "led") {
				blockConditionbox.find(".color input").val(blockConditionbox.attr("data-save-what"));
				blockConditionbox.attr("data-what", blockConditionbox.attr("data-save-what"));

				blockConditionbox.find(".red input").val(blockConditionbox.attr("data-save-red"));
				blockConditionbox.attr("data-red", blockConditionbox.attr("data-save-red"));

				blockConditionbox.find(".green input").val(blockConditionbox.attr("data-save-green"));
				blockConditionbox.attr("data-green", blockConditionbox.attr("data-save-green"));

				blockConditionbox.find(".blue input").val(blockConditionbox.attr("data-save-blue"));
				blockConditionbox.attr("data-blue", blockConditionbox.attr("data-save-blue"));
			} else if(dataLogic == "display") {
				blockConditionbox.find(".what input").val(blockConditionbox.attr("data-save-what"));
				if(blockConditionbox.attr("data-save-what") == "Drawing") {
					blockConditionbox.attr("data-drawing", blockConditionbox.attr("data-save-drawing"));
					blockConditionbox.find(".data input").val("Picture");
				} else if(blockConditionbox.attr("data-save-what") == "Text") {
					blockConditionbox.attr("data-text", blockConditionbox.attr("data-save-text"));
					blockConditionbox.find(".data input").val(blockConditionbox.attr("data-save-text"));
				}
			} else if(dataLogic == "speaker") {
				blockConditionbox.find(".what input").val(blockConditionbox.attr("data-save-what"));
				blockConditionbox.attr("data-what", blockConditionbox.attr("data-save-what"));
				
				blockConditionbox.find(".frequency input").val(blockConditionbox.attr("data-save-frequency"));
				blockConditionbox.attr("data-frequency", blockConditionbox.attr("data-save-frequency"));

				blockConditionbox.find(".volume input").val(blockConditionbox.attr("data-save-volume"));
				blockConditionbox.attr("data-volume", blockConditionbox.attr("data-save-volume"));
			}
		}	

		var commentText = $(".main .editor .body > .list .comment .commentText");
		for(i = 0; i < commentText.length; i++) {
			$(commentText[i]).val($(commentText[i]).attr("data-text"));
		}
		guiblock.setEditorScroll();
	}

	function setPlumbColor(ddItem) {
		console.log("(project.js) set plumb color");

		for(i = 0; i < ddItem.length; i++) {
			if($(ddItem[i]).hasClass("output")) {
				$(ddItem[i]).find(".blockConditionBox .ok div").trigger("click");
				return;
			}
		}	
	}

	function getNetworkModuleUUIDs() {
		var uuids = [];

		$(".map .module .network").each(function(itr) {
			uuids.push($(this).data("UUID"));
		});

		return uuids;
	}

	return {
		init: init,
		close: close,
		open: open,
		save: save,
		getNetworkModuleUUIDs: getNetworkModuleUUIDs
	};
});