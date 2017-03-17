define(["jquery", "console", "jquerysieve", 'cordova', 'electron', 'moduleboxM'], function($, console, sieve, cordova, electron, moduleboxM) {
	console.log("MODULEBOX INIT");
	
	var a = 0;
	var b = 0;

	var editorWidth;

	var variableModule = $(".modulebox .variableBody").outerHeight(true);
	var inputModule = $(".modulebox .inputBody").outerHeight(true);
	var outputModule = $(".modulebox .outputBody").outerHeight(true);
	var etcModule = $(".modulebox .etcBody").outerHeight(true);

	function toggleModuleboxHandler(event) {
		console.log("(modulebox.js)toggle modulebox handler");

		if($(this).hasClass("openModulebox")) {
			$(".editor .body > .list > .action").animate({
				width: '+=300px'
			}, 450);
			if($(".editor").hasClass("editorWidth")) {
				console.log("editor width <= 300");
				if($(".editor").width() <= 305) {
					$(".editor").animate({
						width: editorWidth
					}, 450);
					$(".map").animate({
						width: $(".main > .body").width() + 300 - editorWidth - 4
					}, 450);
				} else {
					$(".editor").animate({
						width: '+=300'
					}, 450);
				}
				$(".editor").removeClass("editorWidth");
			} else {
				console.log("editor width > 300");
				$(".editor").animate({
					width: '+=300px'
				}, 450);
			}
			$(".modulebox").animate({
				right: '-=300px'
			}, 450);
			$(".moduleboxBtn").animate({
				right: '-=300px'
			}, 450);
			$(".main > .body").animate({
				width: '+=300px'
			}, 450);
			var interval = window.setInterval(function() {
				$(".editor > .body > .list").css({
					"width": $(".editor > .body").outerWidth(true) - 4,
					"height": $(".editor > .body").outerHeight(true) - 4
				});
				$(".editor .body > .list > .action").css({
					"width": $(".editor .body > .list").outerWidth(true) - 4
				});
				a++;
			}, 10);
			window.setTimeout(function() {
				clearInterval(interval);
			}, 500);
		}
		else {
			editorWidth = $(".editor").width();
			console.log("editor width : "+$(".editor").width());
			if($(".editor").width() <= 605) {
				console.log("editor width <= 300");
				$(".editor").animate({
					width: '300px'
				}, 600);
				$(".map").animate({
					width: $(".main > .body").width() - 300 - 305 + 1
				}, 600);
				$(".editor").addClass("editorWidth");
			} 
			else {
				console.log("editor width > 300");
				$(".editor").animate({
					width: '-=300px'
				}, 600);
			}
			$(".modulebox").animate({
				right: '+=300px'
			}, 600);
			$(".moduleboxBtn").animate({
				right: '+=300px'
			}, 600);
			$(".main > .body").animate({
				width: '-=300px'
			}, 600);
			var inter = window.setInterval(function() {
				$(".editor > .body > .list").css({
					"width": $(".editor > .body").outerWidth(true) - 4,
					"height": $(".editor > .body").outerHeight(true) - 4
				});
				$(".editor .body > .list > .action").css({
					"width": $(".editor .body > .list").outerWidth(true) - 4
				});
				b++;
			}, 10);

			window.setTimeout(function() {
				clearInterval(inter);
			}, 600);
		}
		$(this).toggleClass("openModulebox");

		event.stopPropagation();
	}

	function moduleboxTabOn(onTab) {
		$(".modulebox > .tab > .hardware").css({"background": "none"});
		$(".modulebox > .tab > .custom").css({"background": "none"});
		$(".modulebox > .tab > .moduleset").css({"background": "none"});
		$(".modulebox > .tab > .hardware").css({"color": "rgb(188, 188, 188)"});
		$(".modulebox > .tab > .custom").css({"color": "rgb(188, 188, 188)"});
		$(".modulebox > .tab > .moduleset").css({"color": "rgb(188, 188, 188)"});

		$(".modulebox > .tab > "+onTab+" ").css({
			"background": "url('image/modulebox/moduleboxTabHover.svg') no-repeat",
			"background-position-y": "26px"
		});
		$(".modulebox > .tab > "+onTab+" ").css({"color": "rgb(38, 202, 211)"});
	}

	function showHardwareHandler(event) {
		console.log("(modulebox.js)show hardware handler");
		toggleClassModuleboxTab(".hardware", ".hardwareBody");
		
		if(cordova.isCordova()) {
			$(".tab > .hardware").addClass("itemOnColor");
			$(".tab > .custom").removeClass("itemOnColor");
		}
		event.stopPropagation();
	}

	function showCustomHandler(event) {
		console.log("(modulebox.js)show custom handler");
		toggleClassModuleboxTab(".custom", ".customBody");

		if(cordova.isCordova()) {
			$(".tab > .hardware").removeClass("itemOnColor");
			$(".tab > .custom").addClass("itemOnColor");
		}
		event.stopPropagation();
	}

	function showModulesetHandler(event) {
		console.log("(modulebox.js)show moduleset handler");
		toggleClassModuleboxTab(".moduleset", ".moduleset");

		event.stopPropagation();
	}

	function toggleClassModuleboxTab(targetTab, targetBody) {
		if(electron.isElectron()) {
			moduleboxTabOn(targetTab);
		} else if(cordova.isCordova()) {
			moduleboxM.showModulesetHandlerMobile();
		}
		$(".modulebox > .body > div").addClass("noneDisplayModuleboxBody");
		$(".modulebox > .body > " + targetBody).removeClass("noneDisplayModuleboxBody");
	}

	function searchKeyupHandler(event) {
		console.log("(modulebox.js) search keyup handler");

		setHeight(variableModule, ".variableBody");
		setHeight(inputModule, ".inputBody");
		setHeight(outputModule, ".outputBody");
		setHeight(etcModule, ".etcBody");

		function setHeight(modules, body) {
			if($(".modulebox "+body+" .hardwareArrow").hasClass("moduleboxModulesetArrow")) {
				$(".modulebox "+body+" .hardwareArrow").parent().css({"height": "auto"});
				modules = $(".modulebox "+body).outerHeight(true);
				$(".modulebox "+body+" .hardwareArrow").parent().css({"height": 50});
			} else if(!$(".modulebox "+body+" .hardwareArrow").hasClass("moduleboxModulesetArrow")) {
				$(".modulebox "+body+" .hardwareArrow").parent().css({"height": 50});
				modules = $(".modulebox "+body).outerHeight(true);
				$(".modulebox "+body+" .hardwareArrow").parent().css({"height": "auto"});
			}
		}
	}

	function toggleHardwareHandler(event) {
		console.log("(modulebox.js)toggle hardware handler");
		var autoHeight;

		$(event.target).parent().toggleClass("moduleboxModuleset");
		
		if($(event.target).parent().hasClass("moduleboxModuleset")) {
			$(event.target).parent().animate({
				height: 50
			}, 50);
		} else if(!$(event.target).parent().hasClass("moduleboxModuleset")) {
			$(event.target).parent().css({"height": "auto"});
			autoHeight = $(event.target).parent().outerHeight(true);
			$(event.target).parent().css({"height": 50});

			$(event.target).parent().outerHeight(50).animate({
				height: autoHeight
			}, 50);
		}

		$(event.target).toggleClass("moduleboxModulesetArrow");
		
		event.stopPropagation();
	}

	function toggleModulesetHandler(event) {
		console.log("(modulebox.js)toggle moduleset handler");
		var autoHeight = $(this).parent().parent().css({"height":"auto"}).outerHeight(true);
		$(this).parent().parent().toggleClass("moduleboxModuleset");
		if($(this).parent().parent().hasClass("moduleboxModuleset")) {
			$(this).parent().parent().animate({
				height: 50
			}, 50);
		} else if(!$(this).parent().parent().hasClass("moduleboxModuleset")) {
			$(this).parent().parent().outerHeight(50).animate({
				height: autoHeight
			}, 50);
		}
		$(this).toggleClass("moduleboxModulesetArrow");
		event.stopPropagation();
	}
	
	/**
		change tagname

		* tag: "element's tag" is change to "tag"

		* using: $(element).changeTag('tagname');
	*/
	$.fn.changeTag = function(tag){
		var replacement = $('<' + tag + '>');
		var attributes = {};
		$.each(this.get(0).attributes, function(index, attribute) {
			attributes[attribute.name] = attribute.value;
		});
		replacement.attr(attributes);
		replacement.data(this.data());
		var contents = this.children().clone(true);
		replacement.append(contents);
		this.replaceWith(replacement);
	};

	/**
		enable drag and drop from modulebox to modulemap
	*/
	function dndModuleboxToModulemap() {
		$(".modulebox .hardwareBody .module:not(.empty)").draggable({
			helper: function() {
				return $(this).clone().appendTo(".map").css({
					"z-index": 5
				});
			},
			cursor: 'point',
			containment: 'document'
		});

		$(".modulemap").droppable({
			accept: ".modulebox .hardwareBody .module",
			drop: function(event, ui) {
				var mapmodule = require('mapmodule');

				if(!ui.draggable.hasClass("dropped")) {
					var parentOffset = $(this).parent().offset();
					var relX = event.pageX - parentOffset.left;
					var relY = event.pageY - parentOffset.top;
					var obj = {};
					var el = new mapmodule.Mapmodule();
					
					obj.uuid = 0;
					obj.id = 0;
					obj.type = ui.draggable.attr("class").split(/\s+/)[1];
					obj.subtype = ui.draggable.attr("class").split(/\s+/)[1];
					obj.subtitle = ui.draggable.attr("class").split(/\s+/)[2];
					obj.title = ui.draggable.attr("class").split(/\s+/)[3];
					obj.from = "modulebox";
					obj.status = "disconnected";
					obj.name = obj.type;
					obj.moved = false;

					el.module = $(ui.draggable[0]).clone().draggable(false);
					el.appendModule(relX-50, relY-45, obj);
					$(el.module[0]).find(".image").addClass("dd-handle");
					$(el.module[0]).addClass("dd-item").changeTag("li");
				}
				// dndModulemapToEditor();

				var ddItem = $(".editor li.dd-item");
				for(i = 0; i < ddItem.length; i++) {
					if($(ddItem[i]).hasClass("output")) {
						$(ddItem[i]).find(".blockConditionBox .ok div").trigger("click");
						return;
					}
				}
			}
		});
	}

	var sieveOptions = {
		searchTemplate: $(".modulebox .search"),
		itemSelector: ".module"
	};

	$(document).ready(function() {
		dndModuleboxToModulemap();

		$(".modulebox > .tab > .hardware").on("click", showHardwareHandler);
		$(".modulebox > .tab > .custom").on("click", showCustomHandler);
		$(".modulebox > .tab > .moduleset").on("click", showModulesetHandler);
		$(".modulebox .hardwareArrow").on("click", toggleHardwareHandler);
		$(".modulebox .modulesetArrow").on("click", toggleModulesetHandler);

		$(".modulebox .search").on("keyup", searchKeyupHandler);

		if(electron.isElectron()) {
			console.log("(modulebox.js) with pc");
			$(".moduleboxBtn").on("click", toggleModuleboxHandler);
			$(".modulebox > .body").sieve(sieveOptions);
			$(".modulebox .search").find("input").attr("tabindex", "-1");

			setEmptybox(3);
		} else if(cordova.isCordova()) {
			moduleboxM.inDocumentReady();
			moduleboxM.toggleModulebox();
			moduleboxM.showModulebox();
			moduleboxM.toggleShowModulebox();

			setEmptybox(4);

			/**
				모바일 modulebox tab 디자인, 이벤트 처리
			*/
			moduleboxM.setModuleBoxTab();
			$(".tab > .hardware").on("click",function(){
				$(".tab > .hardware").addClass("itemOnColor");
				$(".tab > .custom").removeClass("itemOnColor");
			});
			$(".tab > .custom").on("click",function(){
				$(".tab > .custom").addClass("itemOnColor");
				$(".tab > .hardware").removeClass("itemOnColor");
			});
			$(".imgModulebox").on("touchstart touchend",function(event){
				moduleboxM.hoverEvent(event);

				if(event.type == 'touchstart'){
					return;
				}
				
				$(".map").toggleClass("lookMap");
				$(".mapSetting").toggleClass("lookMapSetting");
				$(".modulebox").toggleClass("lookModulebox");
				$(".mobileBackground").toggleClass("showMobileBackground");
				$(".moduleboxBtn").toggleClass("showModuleboxBtn");
				moduleboxM.hideModulebox();

				event.preventDefault();
			});
		}
	});


	function setEmptybox(repeat) {
		moduleboxEmptybox($(".modulebox .body.variableModule"), repeat);
		moduleboxEmptybox($(".modulebox .body.inputModule"), repeat);
		moduleboxEmptybox($(".modulebox .body.outputModule"), repeat);
		moduleboxEmptybox($(".modulebox .body.etcModule"), repeat);
	
		
		function moduleboxEmptybox(where, repeat) {
			var body = where;
			var rest = body.find("> div").size() % repeat;

			if(rest !== 0) {
				for(var i = 1; i <= repeat - rest; i++ ) {
					body.append('<div class="module empty"><div class="image"></div></div>');
				}
			}
		}
	}

	return {
		dndModuleboxToModulemap: dndModuleboxToModulemap
	};
});