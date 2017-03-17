define(["jquery", "console"], function($, console) {
	console.log("MENUBOX INIT");
	var saveStarted = 0;

	function toggleClassShow(tClass, rClassA, rClassB, tArrow, rArrowA, rArrowB) {
		$("#context-menu-layer").trigger("mousedown");

		$(".main > .menubox > "+tClass).toggleClass("show");
		$(".main > .menubox > "+rClassA).removeClass("show");
		$(".main > .menubox > "+rClassB).removeClass("show");
		$(".main > .menubox > "+tArrow).toggleClass("show");
		$(".main > .menubox > "+rArrowA).removeClass("show");
		$(".main > .menubox > "+rArrowB).removeClass("show");
	}

	function projectHandler(event) {
		console.log("(menubox.js)project handler");
		toggleClassShow(".projectBox", ".settingBox", ".helpBox", ".projectBoxArrow", ".settingBoxArrow", ".helpBoxArrow");
		event.stopPropagation();
	}

	function settingHandler(event) {
		console.log("(menubox.js)setting handler");
		toggleClassShow(".settingBox", ".projectBox", ".helpBox", ".settingBoxArrow", ".projectBoxArrow", ".helpBoxArrow");

		// var builder = require('builder');
		// var title = require('title');
		// builder.setUpdateMode(3);
		// var luxc = title.genResetCode();
		// builder.begin(luxc);

		event.stopPropagation();
	}

	function helpHandler(event) {
		console.log("(menubox.js)help handler");
		toggleClassShow(".helpBox", ".settingBox", ".projectBox", ".helpBoxArrow", ".settingBoxArrow", ".projectBoxArrow");
		event.stopPropagation();
	}

	function openProjectHandler(event) {
		console.log("(menubox.js)open project handler");

		var modal = require('modal');

		modal.openModal(".openproject");

		modal.setSieveOpenproject();
	}

	function newProjectHandler(event) {
		console.log("(menubox.js)new project handler");
		
		var modal = require('modal');
		// modal.openModal(".newproject");
		
		modal.resettingNewProjectList(function(){
			modal.openModal(".newproject");
		});
	}

	function saveProjectHandler(event) {
		console.log("(menubox.js)save project handler");

		var file = require('file');
		var project = require('project');
		var projectName = $(".title .titleName").text();
		file.saveProject(projectName, project.save(), function(bSuccess){
			console.log("save result: "+bSuccess);
		});
		// file.saveRecentFile(projectName, function(bSuccess) {
		// 	console.log("save result: "+bSuccess);
		// });
	}

	function saveAsProjectHandler(event) {
		console.log("(menubox.js)save as project handler");

		var modal = require('modal');

		modal.openModal(".saveproject");
	}

	function autoActionHandler(event) {
		console.log("(menubox.js)auto action handler");
	}

	function tutorialHandler(event) {
		console.log("(menubox.js)tutorial handler");

		var modal = require('modal');

		modal.openModal(".gettingproject");
	}

	function updateCheckHandler(event) {
		console.log("(menubox.js)update check handler");
	}

	function qnaHandler(event) {
		console.log("(menu.js)Q&A Handler");
	}

	function startPeriodicalSave() {
		if(!saveStarted) {
			saveStarted = 1;
			setInterval(function() {
				saveProjectHandler();
			}, 60000);
		}
	}

	function openSetting(event) {
		console.log("(menubox.js) open setting");

		var selected;
		var language = $(".modal .setting .selected").attr("data-save-lang");

		var modal = require('modal');
		modal.openModal(".setting");


		if(language == "en") {
			selected = "English";
		} else if(language == "ko") {
			selected = "Korean";
		}

		$(".modal .setting .selected").text(selected);
	}

	$(document).ready(function() {
		$(".title .project").on("click", projectHandler);
		$(".title .setting").on("click", settingHandler);
		$(".title .help").on("click", helpHandler);
		$(".menubox .open").on("click", openProjectHandler);
		$(".menubox .new").on("click", newProjectHandler);
		$(".menubox .save").on("click", saveProjectHandler);
		$(".menubox .saveas").on("click", saveAsProjectHandler);
		$(".menubox .autoaction").on("click", autoActionHandler);
		$(".menubox .tutorial").on("click", tutorialHandler);
		$(".menubox .updatecheck").on("click", updateCheckHandler);
		$(".menubox .qna").on("click", qnaHandler);

		// multi language 설정 지워 놓음
		$(".title .editorSetting .setting").on("click", openSetting);
	});

	return {
		startPeriodicalSave: startPeriodicalSave
	};
});