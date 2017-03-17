define(["jquery", "console", "mapmodule", "dygraph"], function($, console, mapmodule, dygraph) {
	console.log("MONITORING INIT");

	var i;
	var cloned;
	var graph;
	var graphID = "";
	var moduleID = "";
	var moduleUUID = "";
	var dataArr = [];
	var data = [];
	var dataSize = 300;
	var arrowFlag = false;
	var top = 1000;
	var bottom = 0;
	var moduleType = "";
	var moduleSubtitle = "";
	var length = 0;
	var prop = "";
	var srcName = "";

	var disconFlag = false;

	var property = {
		mic: {
			Volume: "LUX_MIC_VOLUME",
			Frequency: "LUX_MIC_FREQUENCE"
		},
		button: {
			Click: "LUX_BUTTON_CLICK",
			"Double Click": "LUX_BUTTON_DBLCLICK",
			"Press Status": "LUX_BUTTON_PUSH",
			Toggle: "LUX_BUTTON_TOGGLE"
		},
		dial: {
			Turn: "LUX_DIAL_DEGREE",
			Speed: "LUX_DIAL_SPEED"
		},
		ir: {
			Distance: "LUX_IR_DIST",
			Bright: "LUX_IR_BRIGHT"
		},
		ultrasonic: {
			Distance: "LUX_ULTRASONIC_DIST"
		},
		environment: {
			Temperature: "LUX_ENVIRONMENT_TEMPER",
			Humidity: "LUX_ENVIRONMENT_HUMID",
			Illuminance: "LUX_ENVIRONMENT_BRIGHT",
			Red: "LUX_ENVIRONMENT_RED",
			Green: "LUX_ENVIRONMENT_GREEN",
			Blue: "LUX_ENVIRONMENT_BLUE"
		},
		gyro: {
			Roll: "LUX_GYRO_ROLL",
			Pitch: "LUX_GYRO_PITCH",
			Yaw: "LUX_GYRO_YAW",
			"X Acceleration": "LUX_GYRO_ACCELX",
			"Y Acceleration": "LUX_GYRO_ACCELY",
			"Z Acceleration": "LUX_GYRO_ACCELZ",
			"X Angular velocity": "LUX_GYRO_GYROX",
			"Y Angular velocity": "LUX_GYRO_GYROY",
			"Z Angular velocity": "LUX_GYRO_GYROZ",
			Vibration: "LUX_GYRO_VIBRATION"
		},
		led: {
			Red: "LUX_LED_RED",
			Green: "LUX_LED_GREEN",
			Blue: "LUX_LED_BLUE"
		},
		speaker: {
			Volume: "LUX_SPEAKER_VOLUME",
			Frequency: "LUX_SPEAKER_FREQ"
		},
		motor: {
			"Upper Angle": "LUX_MOTOR_RANGLE",
			"Upper Speed": "LUX_MOTOR_RSPEED",
			"Upper Torque": "LUX_MOTOR_RTORQUE",
			"Bottom Angle": "LUX_MOTOR_LANGLE",
			"Bottom Speed": "LUX_MOTOR_LSPEED",
			"Bottom Torque": "LUX_MOTOR_LTORQUE"
		}
	};

	function open(type, name, classes) {
		if(!graph && (type !== "display")) {

			moduleType = type;

			if(type == "mic") {					// type에 따른 top, bottom값
				moduleSubtitle = "input";
				top = 100;
				bottom = 0;

			} else if(type == "dial") {
				moduleSubtitle = "input";
				top = 100;
				bottom = 0;

			} else if(type == "environment") {
				moduleSubtitle = "input";
				top = 100;
				bottom = 0;

			} else if(type == "gyro") {
				moduleSubtitle = "input";
				top = 100;
				bottom = -100;

			} else if(type == "button") {
				moduleSubtitle = "input";
				top = 100;
				bottom = 0;

			} else if(type == "ir") {
				moduleSubtitle = "input";
				top = 100;
				bottom = 0;

			} else if(type == "ultrasonic") {
				moduleSubtitle = "input";
				top = 100;
				bottom = 0;

			} else if(type == "motor") {
				moduleSubtitle = "output";

			} else if(type == "led") {
				moduleSubtitle = "output";

			} else if(type == "speaker") {
				moduleSubtitle = "output";

			} else if(type == "number") {
				moduleSubtitle = "number";

			} else if(type == "random") {
				moduleSubtitle = "random";

			}

			if(classes.includes("con")) {
				graphID = "graph-"+name;
				var key;
				var list;
				var i;

				length = 0;

				cloned = $(".monitoring").clone().css({
					"display": "initial"
				}).appendTo("body > .main");

				var checkboxinputId = "checkboxInput" + name;

				cloned.find(".checkboxInput").attr("id", checkboxinputId);
				cloned.find(".checkboxLabel").attr("for", checkboxinputId);
				cloned.find(".checkboxText").attr("for", checkboxinputId);

				enableDraggable(cloned);

				cloned.find(".body > .graph").attr("id", graphID);
				cloned.find(".icon").addClass(type);
				cloned.find(".name").val(name);
				list = cloned.find(".list");

				for(key in property[type]) {
					length += 1;
					list.append("<div class='item'>" + key + "</div>");
				}

				$(".monitoring .select .list").css({
					"height": 0,
					"border": 0
				});

				$(".map .module").each(function(itr) {
					if($(this).data("name") == name) {
						moduleID = $(this).data("id");
						moduleUUID = $(this).data("uuid");
						return false;
					}
				});

				$(cloned.find(".item")[0]).trigger("click");

				for(i = 0; i < 100; i++) {
					$(".monitoring .content").append("<tr id="+name+i+"><td class='time'></td><td class='data'></td></tr>");
				}
			} else {
				cloned = $(".modulesetting.rename").clone().css({
					"display": "initial"
				}).appendTo("body > .main");

				enableDraggable(cloned);

				cloned.find(".icon").addClass(type);
				cloned.find(".name").val(name);


				$(".map .module").each(function(itr) {
					if($(this).data("name") == name) {
						moduleID = $(this).data("id");
						moduleUUID = $(this).data("uuid");
						return false;
					}
				});

				$(cloned.find(".item")[0]).trigger("click");
			}

			disconFlag = true;
		}
	}

	function close(name) {
		var graphID = "graph-"+name;
		var moduleID = "";

		$(".map .module").each(function(itr) {
			if($(this).data("name") == name) {
				moduleID = $(this).data("id");
				return false;
			}
		});
		stop(moduleID);

		$("#"+graphID).closest(".monitoring").remove();

	}

	function start(graphID, moduleID, prop) {
		var daemon = require('daemon');

		stop(moduleID);
		console.log("(monitoring.js)start data monitoring");

		for(i = 0; i < dataSize; i++) {
			data.push([i, 0, top, bottom]);
			dataArr.push(0);
		}

		graph = new Dygraph(
			document.getElementById(graphID),
			data,
			{
				width: 488,
				height: 140,
				fillGraph: true,
				colors: ['#26cad3', '#bbb'],
				labels: ['Time', 'Data', 'Top', 'Bottom'],
				axisLabelFontSize: 10
			});

		daemon.monitoringOn(moduleUUID, prop);
	}

	function stop(moduleID) {
		console.log("(monitoring.js)stop data monitoring");
		var daemon = require('daemon');
		graph = null;
		dataArr = [];
		data = [];

		daemon.monitoringOff(moduleUUID);
	}

	function update(val) {
		dataArr.shift();
		dataArr.push(val);
		for(i = 0; i < dataSize; i++) {
			data[i][1] = dataArr[i];
		}
		graph.updateOptions({
			'file': data
		});

		$(cloned.find(".content tr")[99]).remove();
		cloned.find(".content tbody").prepend("<tr><td class='time'>"+new Date().toLocaleTimeString()+"</td><td class='data'>"+val+"</td></tr>");
	}

	function enableDraggable(elem) {
		$(elem).draggable({
			handle: ".title",
			cancel: ".exit"
		});
	}

	function closeHandler(event) {
		console.log("(monitoring.js)close handler");

		stop();
		$(event.target).closest(".monitoring").remove();
		$(event.target).closest(".modulesetting.rename").remove();

		disconFlag = false;
		event.stopPropagation();
	}

	function exportHandler(event) {
		console.log("export handler", "monitoring.js");

		var file = require('file');
		var data = "";

		$($(".monitoring .content")[1]).find("tr").each(function(itr) {
			if($(this).find(".time").text() !== "") {
				data += $(this).find(".time").text();
				data += " : ";
				data += $(this).find(".data").text();
				data += "\r\n";
			}
		});
		file.saveMonitoringData(data, function(b) {
			console.log("save file:" + b, "monitoring.js");
		});

		event.stopPropagation();
	}

	function bodyClickHandler(event) {
		console.log("(monitoring.js)body click handler");

		$(".monitoring").css({
			"z-index": 2000
		});

		$(event.target).closest(".monitoring").css({
			"z-index": 2001
		});

		event.stopPropagation();
	}

	function arrowClickHandler(event) {
		console.log("(monitoring.js)arrow click handler");

		var key;
		var height;

		height = length * 30;

		if(arrowFlag) {
			$(".monitoring .select .list").css({
				"height": 0,
				"border": 0
			});
		} else {
			$(".monitoring .select .list").css({
				"height": height,
				"border": "1px solid #e6e6e6"
			});
		}

		arrowFlag = !arrowFlag;
		event.stopPropagation();
	}

	function itemClickHandler(event) {
		console.log("(monitoring.js)item click handler");

		cloned.find(".selected").text($(event.target).text());
		cloned.find(".table .title .data").text($(event.target).text());
		prop = property[moduleType][$(event.target).text()];

		$(".monitoring .select .list").css({
			"height": 0,
			"border": 0
		});
		arrowFlag = false;

		start(graphID, moduleID, prop);

		event.stopPropagation();
	}

	function nameFocusHandler(event) {
		srcName = $(event.target).val();
	}

	function nameFocusoutHandler(event) {
		console.log("(monitoring.js)name focusout handler");
		var main = require("main");
		var guiblock = require("guiblock");
		var name = $(event.target).val();
		var onEditors = $(".editor .onEditor");
		var h;
		var w;
		var d;

		if(!mapmodule.isNameExist(name) && (name !== undefined) && (name !== "")) {
			h = $(".main > .body").html();
			w = JSON.parse(JSON.stringify(guiblock.getArrWhat()));

			mapmodule.changeName(srcName, name);

			if(moduleSubtitle == "input") {
				d = JSON.parse(JSON.stringify(guiblock.getArrInput()));
				guiblock.changeInputName(srcName, name);
			} else if(moduleSubtitle == "output") {
				d = JSON.parse(JSON.stringify(guiblock.getArrOutput()));
				guiblock.changeOutputName(srcName, name);
			} else if(moduleSubtitle == "network") {
				d = JSON.parse(JSON.stringify(guiblock.getArrNetwork()));
				guiblock.changeNetworkName(srcName, name);
			} else if(moduleSubtitle == "number") {
				d = JSON.parse(JSON.stringify(guiblock.getArrNumber()));
				guiblock.changeNumberName(srcName, name);
			} else if(moduleSubtitle == "random") {
				d = JSON.parse(JSON.stringify(guiblock.getArrRandom()));
				guiblock.changeRandomName(srcName, name);
			}

			onEditors.each(function(itr) {
				var blockWrapper = $(this).children(".block").children(".blockWrapper");
				var blockName = $(blockWrapper).children(".name");
				var boxWrapper = $(this).children(".blockConditionBox").children(".boxWrapper");
				var boxName = $(boxWrapper).children(".name");
				var inputs = $(boxWrapper).find("input");
				var ok = $(boxWrapper).children(".ok, .then").children("div");

				if($(blockName).text() == srcName) {
					blockName.text(name);
				}

				if($(boxName).text().split(" 's")[0] == srcName) {
					boxName.text(name + " 's");
				}

				inputs.each(function(itr) {
					var re = new RegExp(srcName, "g");
					$(this).val($(this).val().replace(re, name));
				});

				$(ok).trigger("click");
			});
	
			main.pushUndo(1, "body", h, w, moduleSubtitle, d);
		}

		event.stopPropagation();
	}

	function keypressHandler(event) {
		if(event.keyCode == 27) {
			console.log("(monitoring.js)ESC pressed");

			if(cloned) {
				stop();
				cloned.remove();
			}
		}
	}

	function toggleGraphHandler(event) {
		var body = $(event.target).closest(".body");
		var toggle = $(body).find(".toggle");
		
		toggle.find(".graph").css({
			"color": "white",
			"background-color": "#26CAD3"
		});
		toggle.find(".table").css({
			"color": "#26CAD3",
			"background-color": "white"
		});

		body.children(".graph").show();
		body.children(".table").hide();
	}

	function toggleTableHandler(event) {
		var body = $(event.target).closest(".body");
		var toggle = $(body).find(".toggle");
		
		toggle.find(".table").css({
			"color": "white",
			"background-color": "#26CAD3"
		});
		toggle.find(".graph").css({
			"color": "#26CAD3",
			"background-color": "white"
		});

		body.children(".graph").hide();
		body.children(".table").show();
	}

	$(document).ready(function() {
		$(document).on("keyup", keypressHandler);
		$("body > .main").on("click", ".monitoring .exit", closeHandler);
		$("body > .main").on("click", ".monitoring .close", closeHandler);
		$("body > .main").on("click", ".monitoring .export", exportHandler);
		$("body > .main").on("click", ".monitoring .selected", arrowClickHandler);
		$("body > .main").on("click", ".monitoring .arrow", arrowClickHandler);
		$("body > .main").on("click", ".monitoring .item", itemClickHandler);
		$("body > .main").on("focus", ".monitoring .name", nameFocusHandler);
		$("body > .main").on("focusout", ".monitoring .name", nameFocusoutHandler);
		$("body > .main").on("click", ".monitoring .toggle .graph", toggleGraphHandler);
		$("body > .main").on("click", ".monitoring .toggle .table", toggleTableHandler);
		$("body > .main").on("click", ".monitoring", bodyClickHandler);



		$("body > .main").on("click", ".modulesetting.rename .close", closeHandler);
		$("body > .main").on("focus", ".modulesetting.rename .name", nameFocusHandler);
		$("body > .main").on("focusout", ".modulesetting.rename .name", nameFocusoutHandler);



		$(".monitoring").draggable({
			handle: ".title",
			cancel: ".exit"
		});
	});

	return {
		open: open,
		close: close,
		update: update
	};
});