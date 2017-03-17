define(["jquery", "console", "title", "modulebox", "hideall", "deque", "multiLanguage"], function($, console, title,  modulebox, hideall, deque, multiLanguage) {
	console.log("MAIN INIT", "main.js");

	var undo = new deque.Deque();
	var redo = new deque.Deque();
	var dequeSize = 10;
	var notiCount = 0;
	var placed = {};

	/**
		type: module's type
		  - mic, motor, gyro ...
		UUID: module's UUID
	*/
	function moduleNotification(type, UUID) {
	// function moduleNotification(type) {
		console.log("module notification", "main.js");
		var showTime = 2000;

		if(placed[UUID] === undefined) {
			// placed[UUID] = 1;
			notiCount += 1;

			if(notiCount < 5) {
				$(".main > .newModule").each(function(itr) {
					if(!itr) {		// 처음 noti(clone하기 위한 base noti)는 무시
						return true;
					}
					var bottom = parseInt($(this).css("bottom"));
					$(this).css({
						bottom: bottom+135
					});
				});
			}

			var noti = $($(".main > .newModule")[0]).clone();
			var moduleId = "";

			moduleId += type;
			// moduleId += "\n";
			// moduleId += UUID;

			noti.find(".image").addClass(type);
			noti.find(".id").text(moduleId);

			noti.appendTo($("body > .main"));
			noti.fadeIn(300, function() {
				setTimeout(function() {
					noti.fadeOut(400, function() {
						noti.remove();
						notiCount -= 1;
						// placed[UUID] = undefined;
					});
				}, showTime);
			});
		}
	}

	function setPlaced(UUID) {
		placed[UUID] = 1;
	}

	function unsetPlaced(UUID) {
		placed[UUID] = undefined;
	}

	/**
		f: flag for initializing redo deque (1: init)
		t: target for undo ('editor', 'map', 'body', ...)
		h: html code of target
		w: arrWhat
		a: array name (input, output, network, number, random, ...)
		d: data of array (arrInput, arrOutput, arrNetwork, arrNumber, arrRandom, ...)
		c: count of mapmodule
	*/
	function pushUndo(f, t, h, w, a, d, c) {
		var json_ = {};
		var arr = [];

		json_ = {
			target: t,
			undo: {
				html: h,
				what: w,
				array: {
					name: a,
					data: d
				},
				count: c
			}
		};

		if(undo.getLength >= dequeSize) {
			undo.popfront();
		}
		undo.pushback(json_);

		if(f === 1) {
			redo.empty();
		}
	}

	function popUndo() {
		var map = require('map');
		var editor = require('editor');
		var guiblock = require('guiblock');
		var mapmodule = require('mapmodule');
		var init = require('init');
		var ret = undo.popback();
		var h;
		var w;
		var d;
		var c;

		if(ret === undefined) {
			return;
		}

		if(ret.target === "editor") {
			h = $(".editor .gui").html();
			$(".editor .gui").html(ret.undo.html);

			$(".editor .displayBlock .boxHelp").each(function(itr) {
				guiblock.setDrawing($(this));
				guiblock.setDrawingText($(this));
			});

			pushRedo(ret.target, h);
		} else if(ret.target === "map") {
			h = $(".map .mapBody").html();
			$(".map .mapBody").html(ret.undo.html);
			modulebox.dndModuleboxToModulemap();

			if(ret.undo.array.name === undefined) {
				pushRedo(ret.target, h);
			} else {
				if(ret.undo.array.name === "input") {
					d = JSON.parse(JSON.stringify(guiblock.getArrInput()));
					guiblock.setArrInput(ret.undo.array.data);
				} else if(ret.undo.array.name === "output") {
					d = JSON.parse(JSON.stringify(guiblock.getArrOutput()));
					guiblock.setArrOutput(ret.undo.array.data);
				} else if(ret.undo.array.name === "network") {
					d = JSON.parse(JSON.stringify(guiblock.getArrNetwork()));
					guiblock.setArrNetwork(ret.undo.array.data);
				} else if(ret.undo.array.name === "number") {
					d = JSON.parse(JSON.stringify(guiblock.getArrNumber()));
					guiblock.setArrNumber(ret.undo.array.data);
				} else if(ret.undo.array.name === "random") {
					d = JSON.parse(JSON.stringify(guiblock.getArrRandom()));
					guiblock.setArrRandom(ret.undo.array.data);
				} else {
					d = undefined;
				}

				c = JSON.parse(JSON.stringify(mapmodule.getModuleCount()));
				mapmodule.setModuleCount(ret.undo.count);

				pushRedo(ret.target, h, ret.undo.what, ret.undo.array.name, d, c);
			}
		} else if(ret.target === "body") {
			h = $(".main > .body").html();
			$(".main > .body").html(ret.undo.html);

			w = JSON.parse(JSON.stringify(guiblock.getArrWhat()));
			guiblock.setArrWhat(ret.undo.what);

			if(ret.undo.array.name === "input") {
				d = JSON.parse(JSON.stringify(guiblock.getArrInput()));
				guiblock.setArrInput(ret.undo.array.data);
			} else if(ret.undo.array.name === "output") {
				d = JSON.parse(JSON.stringify(guiblock.getArrOutput()));
				guiblock.setArrOutput(ret.undo.array.data);
			} else if(ret.undo.array.name === "network") {
				d = JSON.parse(JSON.stringify(guiblock.getArrNetwork()));
				guiblock.setArrNetwork(ret.undo.array.data);
			} else if(ret.undo.array.name === "number") {
				d = JSON.parse(JSON.stringify(guiblock.getArrNumber()));
				guiblock.setArrNumber(ret.undo.array.data);
			} else if(ret.undo.array.name === "random") {
				d = JSON.parse(JSON.stringify(guiblock.getArrRandom()));
				guiblock.setArrRandom(ret.undo.array.data);
			} else {
				d = undefined;
			}

			pushRedo(ret.target, h, w, ret.undo.array.name, d);

			editor.setNestable();
			guiblock.editorEventBind();
			map.mapEventBind();
			modulebox.dndModuleboxToModulemap();
		}
		init.editorResizableDestroy();
		init.editorResizable();
		guiblock.bindConnections();

		return ret;
	}

	/**
		t: target for undo ('editor', 'map', 'body', ...)
		h: html code of target
		w: arrWhat
		a: module array ('input', 'output', 'network', 'number', 'random', ...)
		d: data of array (arrInput, arrOutput, arrNetwork, arrNumber, arrRandom, ...)
		c: count of mapmodule
	*/
	function pushRedo(t, h, w, a, d, c) {
		var json_ = {};
		var arr = [];

		json_ = {
			target: t,
			redo: {
				html: h,
				what: w,
				array: {
					name: a,
					data: d
				},
				count: c
			}
		};

		// if(redo.getLength >= dequeSize) {
		// 	redo.popfront();
		// }
		redo.pushback(json_);
	}

	function popRedo() {
		var map = require('map');
		var editor = require('editor');
		var guiblock = require('guiblock');
		var mapmodule = require('mapmodule');
		var init = require('init');
		var ret = redo.popback();
		var h;
		var w;
		var d;

		if(ret === undefined) {
			return;
		}

		if(ret.target === "editor") {
			h = $(".editor .gui").html();
			$(".editor .gui").html(ret.redo.html);

			$(".editor .displayBlock .boxHelp").each(function(itr) {
				guiblock.setDrawing($(this));
				guiblock.setDrawingText($(this));
			});

			pushUndo(0, ret.target, h);
		} else if(ret.target === "map") {
			h = $(".map .mapBody").html();
			$(".map .mapBody").html(ret.redo.html);
			modulebox.dndModuleboxToModulemap();

			if(ret.redo.array.name === undefined) {
				pushUndo(0, ret.target, h);
			} else {
				if(ret.redo.array.name === "input") {
					d = JSON.parse(JSON.stringify(guiblock.getArrInput()));
					guiblock.setArrInput(ret.redo.array.data);
				} else if(ret.redo.array.name === "output") {
					d = JSON.parse(JSON.stringify(guiblock.getArrOutput()));
					guiblock.setArrOutput(ret.redo.array.data);
				} else if(ret.redo.array.name === "network") {
					d = JSON.parse(JSON.stringify(guiblock.getArrNetwork()));
					guiblock.setArrNetwork(ret.redo.array.data);
				} else if(ret.redo.array.name === "number") {
					d = JSON.parse(JSON.stringify(guiblock.getArrNumber()));
					guiblock.setArrNumber(ret.redo.array.data);
				} else if(ret.redo.array.name === "random") {
					d = JSON.parse(JSON.stringify(guiblock.getArrRandom()));
					guiblock.setArrRandom(ret.redo.array.data);
				} else {
					d = undefined;
				}

				c = JSON.parse(JSON.stringify(mapmodule.getModuleCount()));
				mapmodule.setModuleCount(ret.redo.count);

				pushUndo(0, ret.target, h, ret.redo.what, ret.redo.array.name, d, c);
			}
		} else if(ret.target === "body") {
			h = $(".main > .body").html();
			$(".main > .body").html(ret.redo.html);

			w = JSON.parse(JSON.stringify(guiblock.getArrWhat()));
			guiblock.setArrWhat(ret.redo.what);

			if(ret.redo.array.name === "input") {
				d = JSON.parse(JSON.stringify(guiblock.getArrInput()));
				guiblock.setArrInput(ret.redo.array.data);
			} else if(ret.redo.array.name === "output") {
				d = JSON.parse(JSON.stringify(guiblock.getArrOutput()));
				guiblock.setArrOutput(ret.redo.array.data);
			} else if(ret.redo.array.name === "network") {
				d = JSON.parse(JSON.stringify(guiblock.getArrNetwork()));
				guiblock.setArrNetwork(ret.redo.array.data);
			} else if(ret.redo.array.name === "number") {
				d = JSON.parse(JSON.stringify(guiblock.getArrNumber()));
				guiblock.setArrNumber(ret.redo.array.data);
			} else if(ret.redo.array.name === "random") {
				d = JSON.parse(JSON.stringify(guiblock.getArrRandom()));
				guiblock.setArrRandom(ret.redo.array.data);
			} else {
				d = undefined;
			}

			pushUndo(0, ret.target, h, w, ret.redo.array.name, d);

			editor.setNestable();
			guiblock.editorEventBind();
			map.mapEventBind();
			modulebox.dndModuleboxToModulemap();
		}
		init.editorResizableDestroy();
		init.editorResizable();
		guiblock.bindConnections();

		return ret;
	}

	function shortcutHandler(event) {
		if ((event.metaKey || event.ctrlKey) && (String.fromCharCode(event.which).toLowerCase() === 'c')) {
			console.log("You pressed CTRL + C", "main.js");		// copy
		} else if ((event.metaKey || event.ctrlKey) && (String.fromCharCode(event.which).toLowerCase() === 's')) {
			console.log("You pressed CTRL + S", "main.js");		// save
		} else if ((event.metaKey || event.ctrlKey) && (String.fromCharCode(event.which).toLowerCase() === 'z')) {
			console.log("You pressed CTRL + Z", "main.js");		// undo
			popUndo();

			var guiblock = require('guiblock');
			guiblock.setInputbox();
		} else if ((event.metaKey || event.ctrlKey) && (String.fromCharCode(event.which).toLowerCase() === 'y')) {
			console.log("You pressed CTRL + Y", "main.js");		// redo
			popRedo();
		}
	}

	$(document).ready(function() {
		/**
			hide actin list when other clicked.
		*/
		// $(document).on("click", "div:not(.blockConditionBox[data-state='led'] .boxHelp)", hideall.hide);
		$(document).on("click", "div:not('.blockConditionBox')", hideall.hide);
		$(document).on("keydown", shortcutHandler);
		// $(document).on("click", "div", hideall.hide);

		// $(".title > .list > .listMenu").on("click", function() {
		// 	
		// });

		// moduleNotification("motor", 030000);
	});

	return {
		moduleNotification: moduleNotification,
		setPlaced: setPlaced,
		unsetPlaced: unsetPlaced,
		pushUndo: pushUndo
	};
});