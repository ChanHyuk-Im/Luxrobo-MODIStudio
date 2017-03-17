define(["jquery", "console", "cordova", "mapmodule"], function($, console, cordova, mapmodule) {
	/**
		모듈 박스에서 map으로 드래그앤드롭
	*/
	var timeId = 0;
	var touchOffsetX=0;
	var touchOffsetY=0;
	var longClick = false;
	
	function onStartHandler(event){
		console.log("(mapmoduleboxM.js)onStart handler");

		removeLongClickStyle();
		var target = event.currentTarget.firstElementChild;
		timeId = window.setTimeout(function() {
			$(target).css({
			    opacity: ".5"
			});
			event.preventDefault();	//	브라우저이벤트취소
			touchStart(event);//특정시간 이후 한번만 실행
      	}, 500);
	}

	function onMoveHandler(event){
		// console.log("(mapmoduleboxM.js)onMove handler");
		if(timeId !== undefined) {
			window.clearTimeout(timeId);
		}
		if(longClick){			
			touchMove(event);
		}
	}

	function onEndHandler(event){
		console.log("(mapmoduleboxM.js)onEnd handler");
		event.stopPropagation();
		
		if(timeId !== undefined) {
			window.clearTimeout(timeId);
			var target = event.currentTarget.firstElementChild;
			$(target).removeAttr("style");
        }
		if(longClick){	        
	        touchEnd(event);
        }
        longClick = false;
		$(".draggableM").remove();
	}

	function touchStart(event){
		console.log("Event start");
	    var e = event.originalEvent; 
		var targetName = event.currentTarget.className.split(/\s+/);
		var targetClass='';
		
		for(var i in targetName){
			if(i>=targetName.length-1) break;
			targetClass+='.'+targetName[i];
		}

		$(".lookModuleboxBody "+targetClass).clone().appendTo(".main");
		$(".main > "+targetClass).addClass("draggableM");
		$(".draggableM").css({
			"top": e.targetTouches[0].pageY - 50,
			"left": e.targetTouches[0].pageX - 50,
		});

		$(".draggableM .image").css({
			"opacity" : 1,
			"border-radius": "7px",
		    "border": "2px solid rgb(38, 202, 211)",
		    "background-position": "center",
		    "box-sizing" : "border-box",
			"background-image": 'url("../image_mobile/icon60/virtual/'+targetName[1]+'.svg")'
		});
		$(".draggableM").find("div").eq( 1 ).css({
			"display": "none"
		});
	
		touchOffsetX=0;
	    touchOffsetY=0;
		longClick = true;
	}
	
	function touchMove(event){
		// console.log('Event move');
		event.preventDefault();	//	브라우저이벤트취소
	    var e = event.originalEvent; 
		touchOffsetX =  e.targetTouches[0].pageX-50;
		touchOffsetY =  e.targetTouches[0].pageY-50;

		$(".draggableM").offset({
			"top": touchOffsetY,
			"left": touchOffsetX
		});	

	}
	
	function touchEnd(event){
		console.log("Event stop");
	    var e = event.originalEvent; 

		var mapBodyOffsetX = $(".mapBody").offset().left;
		var mapBodyOffsetY = $(".mapBody").offset().top;
		
		var minOffsetY = mapBodyOffsetY + $(".mapBody").height();
		var mapScrollHeight = $(".modulemap").scrollTop();
		if(touchOffsetY+50 < minOffsetY && touchOffsetX > mapBodyOffsetX){
			var relX = touchOffsetX;
			var relY = touchOffsetY;
			var obj = {};
			var el = new mapmodule.Mapmodule();
			
			obj.uuid = 0;
			obj.id = 0;
			obj.type = event.currentTarget.className.split(/\s+/)[1];
			obj.subtitle = event.currentTarget.className.split(/\s+/)[2];
			obj.title = event.currentTarget.className.split(/\s+/)[3];
			obj.from = "modulebox";
			obj.status = "disconnected";
			obj.name = obj.type;
			obj.moved = false;

			var targetName = event.currentTarget.className.split(/\s+/);
			var targetClass="";
			for(var i in targetName){
				if(i>=targetName.length-1) break;
				targetClass+="."+targetName[i];
			}
			el.module = $(".lookModuleboxBody "+targetClass).clone();
			el.appendModule(relX-50, relY+mapScrollHeight, obj);
			$(el.module[0]).find(".image").addClass("dd-handle");
			$(el.module[0]).addClass("dd-item").changeTag("li");

			$(".main > .body > .map ."+targetName[1]+" .image").removeAttr("style");
			$(".main > .body > .map ."+targetName[1]+" .image").css({
				"background-image": "url('../image_mobile/icon60/virtual/"+ targetName[1] +".svg')",
			    "background-repeat": "no-repeat"
			});
		}
	}

	function removeLongClickStyle(){
		/* guiblock, modulebox, map에서 롱클릭 후 변경된 스타일, exit 없앰 */
		var block = $("li").children(".block");
		var outputBlock = $(".output").children(".block");
		var content = block.children(".blockWrapper").children(".content");

		block.removeClass("blockOn");
		block.children(".arrow").removeClass("arrowOn");
		block.children(".blockWrapper").css({"padding" : ""});
		content.removeClass("contentOn");
		content.children(".and").removeClass("andOn");
	    content.children(".or").removeClass("orOn");
	    outputBlock.children(".blockWrapper").children(".image").removeAttr("style");
	    outputBlock.children(".blockWrapper").children(".name").removeAttr("style");
		$(".module").children(".image").removeClass("imageOn");
		$(".blockBackground, .breakBlockBackground").css({
			"margin-left": "",
		    "margin-top": ""
		});
		$(".exit").hide();
	}

	$(document).ready(function() {
		if(cordova.isCordova()){
			$("div").each(function(i){
				if($(this).hasClass("module")){
					$(this).css({
						"touch-action": "initial"
					});
				}
			});
			$(".modulebox .module:not(.empty)").on("touchstart", onStartHandler);
			$(".modulebox .module:not(.empty)").on("touchend", onEndHandler);
			$(".modulebox .module:not(.empty)").on("touchmove", onMoveHandler);	
		}
	});

	return{
		removeLongClickStyle: removeLongClickStyle
	};
});