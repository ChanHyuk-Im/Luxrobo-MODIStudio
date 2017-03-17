define(["jquery", "console", "cordova", "guiblockM"], function($, console, cordova, guiblockM) {
	var blockConditionBox,
		title,
		boxWrapper,
		boxBottomWrapper,
		boxList;

	function setViewport() {
		console.log("(init.js) set viewport in cordova");
		/**
			viewport 설정. scale 값에 따라 배율 변함. 350dp 아래만 viewport 0.9
			galexy s4 : 360, iphone 5: 320
		*/
		var scale = 0.9;
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		console.log(windowWidth+" : "+windowHeight);
		if(windowWidth <= 350) {
			document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, minimum-scale='+scale+',maximum-scale='+scale+',initial-scale=1');
			console.log("windowWidth <= 350");
		}else {
			console.log("windowWidth > 350");
		}
	}

	function setModalDiv() {
		console.log("(init.js) set modal newproject, openproject in cordova");
		/**
			mobile newProject, openProject 크기 설정
		*/			
		$(".modal > .newproject > .body").css({
			"height": $("body").outerHeight(true) * (608/647)
		});
		$(".modal > .newproject > .body > .bluetooth").css({
			"height": $("body").outerHeight(true) * (44/647),
			"line-height": $("body").outerHeight(true) * (44/647)+"px",
			"top": $("body").outerHeight(true) * (68/647)
		});
		$(".modal > .newproject > .body > .bluetooth > .text").css({
			"height": $(".modal > .newproject > .body > .bluetooth").outerHeight(true),
		});
		$(".modal > .newproject > .body > .bluetooth > .switchBtn").css({
			"top": ($(".modal > .newproject > .body > .bluetooth").outerHeight(true) - 32 ) / 2
		});
		$(".modal > .newproject > .body > .button").css({
			"width": $("body").outerWidth(true) * (271/375),
			"height": $(".modal > .newproject > .body").outerHeight(true) * (44/603),
			"left": $("body").outerWidth(true) * (52/375)
		});
		$(".modal > .newproject > .body > .buttonBackground").css({
			"height": $(".modal > .newproject > .body > .button").outerHeight(true) + 16
		});
		$(".modal > .newproject > .body > .text").css({
			"height": $("body").outerHeight(true) * (44/647),
			"bottom": $(".modal > .newproject > .body > .buttonBackground").outerHeight(true),
			"line-height": $("body").outerHeight(true) * (44/647)+"px"
		});
		$(".modal > .newproject > .body > .file").css({
			"height": $("body").outerHeight(true) * (462/603)
		});
		$(".modal > .newproject > .body > .inputText").css({
			"width": $("body").outerWidth(true) * (359/375),
			"left": $("body").outerWidth(true) * (8/375),
			"top": ($("body").outerHeight(true) - $(".modal > .newproject > .body > .file").outerHeight(true) - $(".modal > .newproject > .body > .bluetooth").outerHeight(true) - 44) / 4
		});

		$(".modal > .openproject > .body").css({
			"height": $("body").outerHeight(true) * (608/647)
		});
		$(".modal > .openproject > .body > .inputText").css({
			"width": $("body").outerWidth(true) * (359/375),
			"left": $("body").outerWidth(true) * (8/375),
			"top": ($("body").outerHeight(true) - $(".modal > .newproject > .body > .file").outerHeight(true) - $(".modal > .newproject > .body > .bluetooth").outerHeight(true) - 44) / 4
		});
		$(".modal > .openproject > .body > .file").css({
			"top": $(".modal > .openproject > .body > .inputText").outerHeight(true) + (($("body").outerHeight(true) - $(".modal > .newproject > .body > .file").outerHeight(true) - $(".modal > .newproject > .body > .bluetooth").outerHeight(true) - 44) / 4) * 2,
			"height": $("body").outerHeight(true) - (($("body").outerHeight(true) - $(".modal > .newproject > .body > .file").outerHeight(true) - $(".modal > .newproject > .body > .bluetooth").outerHeight(true) - 44) / 4) - 44
		});
		$(".modal > .openproject > .body > .button").css({
			"width": $("body").outerWidth(true) * (271/375),
			"height": $(".modal > .openproject > .body").outerHeight(true) * (44/603),
			"left": $("body").outerWidth(true) * (52/375)
		});
		$(".modal > .openproject > .body > .buttonBackground").css({
			"height": $(".modal > .openproject > .body > .button").outerHeight(true) + 16
		});
		$(".modal > .openproject > .body > .file > ul > li").css({
			"margin-right": $(".modal > .openproject > .body").outerHeight(true) * (17/647),
			"width": $("body").outerWidth(true) * (171/375)
		});
		var countLi = $(".modal > .openproject > .body > .file > ul").children().length;
		for(var i=0; i<countLi; i++){
			if(i%2!==0)
				$(".modal > .openproject > .body > .file > ul").children().eq(i).css({"margin-right" : 0});
		}

		/**
			modal menu 목록 추가함
		*/	
		var menuTitle = '<div class="menuTitle"><div class="text">Project name modi	</div><div class="titleExit"><div class="image"></div></div></div>';
		var userId = '<div class="userId"><div class="text">iduaiaoapa</div><div class="logout"><div class="text">Logout</div></div></div>';
		var community = '<div class="community"><div class="image"></div><div class="text">Community</div><div class="arrow"></div></div>';
		var empty = '<div class="empty"></div>';
		var save = '<div class="save"><div class="image"></div><div class="text">Save</div></div>';

		$(".modal > .main").prepend(menuTitle);
		$(".modal > .main > .news").after(userId+community+empty);
		$(".modal > .main > .openas").after(save);
		$(".modal > .main > .setting").after(empty);
	}

	function setDivMobile() {
		console.log("(initM.js) setDiv with cordova");

		setViewport();
		setModalDiv();
		setPaletteDiv();
		
		$(".main > .body").css({ "height": $(".main").outerHeight(true)-$(".main > .title").outerHeight(true)-$(".menu").outerHeight(true)});
		$(".menu").css({ "top": $(".main").outerHeight(true)-$(".menu").outerHeight(true)});
		$(".map").css({"height": $(".main").outerHeight(true) - 54});
		$(".map .tab").css({"width": ($(".map").width() - $(".mapSetting").width() - 20) / $(".map .tab").length});
		$(".mapBody > .modulemap").css({"height": $(".mapBody").outerHeight(true)});

		$(".editorCustom > .body").css({"width": $(".editorCustom").width() - 10});
		$(".editorCustom > .body").css({"height": $(".editorCustom").height() - 55 - 17});

		$(".commu").css({"top": $(".title").outerHeight(true)});
	}

	function convertTouchToClick(className) {
		if (window.Touch) {
			$(className).bind("touchstart", function(e) {
				e.preventDefault();
			});
			$(className).bind("touchend", function(e) {
				e.preventDefault();
				return $(this).trigger("click");
			});
		}
	} 

	function setConvertTouchToClick() {
		console.log("(initM.js) set convertTouchToClick with cordova");

		convertTouchToClick(".modulebox .imgModulebox");
		convertTouchToClick(".mapSetting > .lineoff");
		convertTouchToClick(".mapSetting > .networkoff");
		convertTouchToClick(".mapSetting > .reload");
	}


	function inDocumentReady() {

		setConvertTouchToClick();

		// //두 번에 한번든 파란색 유지(in mobile)
		// $(".title > .run").bind('touchstart', function(e) {
		// 	$(e.target).trigger('click');
		// });

		// $(".mapBtn").bind('touchend', function(e) {
		// 	$(e.target).trigger('click');
		// });
		// $(".actionlist > .main > .arrow").bind('touchend', function(e) {
		// 	console.log("aa");
		// 	$(e.target).trigger('click');
		// });


		// var pressTimer;
		// $(".modulemap > .module").mouseup(function(){
		// 	clearTimeout(pressTimer);
		// 	// Clear timeout
		// 	return false;
		// }).mousedown(function(e){
		// 	// Set timeout
		// 	pressTimer = window.setTimeout(function() { 
		// 		console.log("longpress");
		// 		$(e.target).trigger('click');
		// 		console.log("longpress1");
		// 	},2000); 
		// 	return false; 
		// });

		// $(".palette li > .item > .image").mouseup(function(){
		// 	clearTimeout(pressTimer);
		// 	// Clear timeout
		// 	return false;
		// }).mousedown(function(e){
		// 	// Set timeout
		// 	pressTimer = window.setTimeout(function() { 
		// 		console.log("longpress");
		// 		$(e.target).trigger('click');
		// 		console.log("longpress1");
		// 	},2000);
		// 	return false; 
		// });




		// var longpress = false;
		// $(".palette li > .item > .image").on('touchdown', function () {
		//     (longpress) ? alert("Long Press") : alert("Short Press");
		// });

		// var startTime;
		// $(".palette li > .item > .image").on('touchstart', function () {
		//     startTime = new Date().getTime();
		//     longpress = (startTime < 3000) ? false : true;
		// });

	}

	/*
		키보드가 있을 때 없을 때 boxList, body의 크기
	*/
	function resizeM(mainSizeBefore){
		console.log("(initM.js) resize Div");
		var conditionBoxOpenCheck = true;

		$(".list > .action").scrollTop(0);
		$(".blockConditionBox").each(function(i, e){//condition box가 열려 있을 때
			if($(this).css("display") != "none"){
				blockConditionBox = $(this);
				title = $(this).children().eq(0);
				boxWrapper = $(this).find(".boxWrapper");
				boxBottomWrapper = $(this).children().eq($(boxWrapper).length+1);
				boxList = $(boxBottomWrapper).children().eq(0);
				conditionBoxOpenCheck = false;
				return false;
			}
			else{
				return true;
			}
		});
		$(blockConditionBox).css({"height" : $(".main").outerHeight(true) });
		
		if($(".main").outerHeight(true) < mainSizeBefore){
			var boxBottomWrapperHeight = $(".main").outerHeight(true) - $(".title").outerHeight(true) - (44 * ($(boxWrapper).length+1));
			$(blockConditionBox).css({"overflow-y": "auto"});
			$(boxBottomWrapper).css({"height": boxBottomWrapperHeight });
			$(boxList).css({"height": $(boxBottomWrapper).outerHeight(true) });
			
			//키보드가 열였을 때 boxBottomWrapper가 안보일 경우
			if( boxBottomWrapperHeight <= 100){
				$(boxBottomWrapper).css({"height": 255});
				$(boxList).css({"height": $(boxBottomWrapper).outerHeight(true) });				
			}
			
			//boxWrapper가 88px가 아닌 경우
			if(($(boxWrapper).length == 1) && ($(boxWrapper).outerHeight(true) == 44)){
				$(boxList).css({"height": $(boxList).outerHeight(true) + 44});
			}
		}
		else if(conditionBoxOpenCheck){
			$(blockConditionBox).css({"overflow-y": ""});
			$(".main > .menu").show();
			$(".main > .body").css({
				"top": "44px",
				"height": $(".main").height()-$(".main > .title").outerHeight(true)-$(".menu").outerHeight(true)
			});
		}
		else{
			$(".main > .body").css({"height": $(".main").outerHeight(true) - $(".main > .title").outerHeight(true)});	
			guiblockM.resizeConditionBox($(title).parent().parent());
		}
	}

	function setPaletteDiv(){
		var paletteWidth = $(".main > .menu > .palette").width();
		var marginRight= ((paletteWidth-38) - 170)/5;
		$(".main >  .menu > .palette> ul > li").css({ "margin-right": marginRight });
	}
	$(document).ready(function() {
	});

	$(window).resize(function() {
	});

	return {
		setDivMobile: setDivMobile,
		inDocumentReady: inDocumentReady,
		resizeM: resizeM
	};
});