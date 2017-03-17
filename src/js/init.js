define(["jquery", "console", 'cordova', 'electron', 'initM'], function($, console, cordova, electron, initM) {
	console.log("(init.js)LAYOUT INIT");

	function setDiv(eDivideM) {
		console.log("(init.js)setDiv");
		if(electron.isElectron()) {
			$("body > .main").css({"width": $("body").outerWidth(true)});

			if($(".moduleboxBtn").hasClass("openModulebox")) {
				$("body > .main > .body").css({"width": $("body > .main").outerWidth(true)-380});
			}
			else {
				$("body > .main > .body").css({"width": $("body > .main").outerWidth(true)-80});
			}
			$("body > .main > .body").css({ "height": $("body > .main").outerHeight(true)-$(".title").outerHeight(true)});

			$(".titleName").css({"width": $(".title").outerWidth(true)-$(".titleLogo").outerWidth(true)-$(".size").outerWidth(true)});
			$(".main > .menu").css({"height": $("body > .main").outerHeight(true)-$(".title").outerHeight(true) - 5});
			$(".palette").css({"height": $("body > .main > .menu").outerHeight(true)-20});
			$(".editor").css({"width": eDivideM+"%"});
			if($(".editor").width() < 300) {
				console.log("editor < 300");
				$(".editor").css({"width": 300});
			}

			$(".map").css({
				"width": $(".main > .body").outerWidth(true)-$(".editor").outerWidth(true) - 2,
				"height": $(".editor").outerHeight(true) - 4
			});
			if($(".map").width() <= 200) {
				console.log("map < 200");
				$(".map").css({"width": 200});
			}
			$(".modulebox").css({"height": $(".mapBody").outerHeight(true) + 2});
			$(".modulebox > .body").css({"height": $(".modulebox").outerHeight(true)-100-1});
			$(".editor").css({"width": $(".main > .body").outerWidth(true)-$(".map").outerWidth(true)-4});
			$(".editor > .body > .list").css({
				"width": $(".editor > .body").outerWidth(true) - 4 ,
				"height": $(".editor > .body").outerHeight(true) - 4
			});
			$(".editor > .body > .list > .action").css({
				"width": $(".editor > .body > .list").outerWidth(true) - 2,
				"height": $(".editor > .body > .list").outerHeight(true) - 2
			});

			$(".editorComment > .title").css({"width": $(".editorComment").width() - 10});
			$(".editorComment > .body").css({"width": $(".editorComment").width() - 10});
			$(".editorComment > .body").css({"height": $(".editorComment").height() - 16 - 17});
			$(".editorCustom > .body").css({"width": $(".editorCustom").width() - 10});
			$(".editorCustom > .body").css({"height": $(".editorCustom").height() - 55 - 17});

			$(".commu").css({"top": $(".title").outerHeight(true)});
		}
	}

	function editorResizableDestroy() {
		$(".main > .body > .editor").resizable();
		$(".main > .body > .editor").resizable("destroy");
	}

	function editorResizable() {
		console.log("(init.js) editor resizable");
		$(".main > .body > .editor").resizable({
			handles: 'e',
			minWidth: 300,
			start: function(event, ui) {
				var maxwidth = $(".main > .body").width() - 200;
				$(".main > .body > .editor").resizable({
					maxWidth: maxwidth,
					stop: function(event, ui) {
						var element = ui.element;
						var parent = ui.element.parent();

						element.css({
							"width": element.width()/parent.width()*100+"%"
						});
					}
				});
			}
		});
	}

	$(document).ready(function() {
		setDiv(65);
		editorResizable();

		$(".editor > .ui-resizable-handle.ui-resizable-e").css({"background": "rgba(255, 255, 255, 0)"});

		if(cordova.isCordova()) {
			initM.inDocumentReady();
			initM.setDivMobile();
		}
	});

	$(window).resize(function() {
		var editorSize = $("body > .main > .body > .editor").width();
		var mainSize = $("body > .main > .body").width();

		var eDivideM = editorSize / mainSize * 100;

		setDiv(eDivideM);
		if(cordova.isCordova()){
			var  mainSizeBefore = $(".main > .body").height() + $(".main > .menu").height();

			initM.resizeM(mainSizeBefore);
		}
	});

	return {
		setDiv: setDiv,
		editorResizable: editorResizable,
		editorResizableDestroy: editorResizableDestroy
	};
});