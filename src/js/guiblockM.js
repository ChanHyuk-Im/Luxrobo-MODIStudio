define(["jquery", "console", "cordova", "mapmoduleboxM"], function($, console, cordova, mapmoduleboxM) {
	var arrSign = [
		{
			imagePath: "image_mobile/icon29/equal.svg",
			name: "Equal",
			form: "==",
			helpMessage: '<div class="body" style="background: url(\'../image/help/helpBasic.svg\') no-repeat center;"><div class="text"></div></div></div>'
		},
		{
			imagePath: "image_mobile/icon29/greaterThanOrEqual.svg",
			name: "Greater or equal",
			form: ">=",
			helpMessage: '<div class="body" style="background: url(\'../image/help/helpBasic.svg\') no-repeat center;"><div class="text"></div></div></div>'
		},
		{
			imagePath: "image_mobile/icon29/lessThanOrEqual.svg",
			name: "Less or equal",
			form: "<=",
			helpMessage: '<div class="body" style="background: url(\'../image/help/helpBasic.svg\') no-repeat center;"><div class="text"></div></div></div>'
		},
		{
			imagePath: "image_mobile/icon29/notEqual.svg",
			name: "Not equal",
			form: "!=",
			helpMessage: '<div class="body" style="background: url(\'../image/help/helpBasic.svg\') no-repeat center;"><div class="text"></div></div></div>'
		},
		{
			imagePath: "image_mobile/icon29/greaterThan.svg",
			name: "Greater than",
			form: ">",
			helpMessage: '<div class="body" style="background: url(\'../image/help/helpBasic.svg\') no-repeat center;"><div class="text"></div></div></div>'
		},
		{
			imagePath: "image_mobile/icon29/lessThan.svg",
			name: "Less than",
			form: "<",
			helpMessage: '<div class="body" style="background: url(\'../image/help/helpBasic.svg\') no-repeat center;"><div class="text"></div></div></div>'
		}
	];

	function setConditionBox(event){
		console.log('(guiblockM.js)set conditionbox handler in mobile');

		$(".main > .body").css({"height": $(".main").outerHeight(true)});
		$(".blockConditionBox").css({ 
			"height": $("body").outerHeight(true),
			"width":  $(".main > .body").outerWidth(true)
		});

		var notCondiitonBox = false;
		var arr = ['If','While','Loop','Math','Delay','random','number','speaker','led','motor','display'];
		var boxType = event.children().eq(0).text();
		if(event.is("li")){
			boxType = $(event[0]).children().children().eq(1).text().replace(/ /g, '');
			boxType = $.trim(boxType);
			boxType = boxType.replace(/[\=]|[0-9]/g,'');
			if(boxType === ""){
				boxType = $(event[0]).attr("class").split(" ")[1];
			}
		}

		//condition box title을 main의 title 위에 올리기 위함
		$.each(arr, function(i, e){
			if(boxType == e){
				$(".main > .body").css({
					"top": 0
				});
				$(".list > .action").scrollLeft(0);
				if(i == 3){
					$(".boxMathPanel").remove();
				}
				notCondiitonBox = false;
				return false;
			}
			else{
				notCondiitonBox = true;
				return true;
			}
		});

		if($(event).hasClass("onEditor") || $(event).hasClass("off") || notCondiitonBox){
			$(".list > .action").css({"overflow": "auto"});
			$(".main > .menu").show();
			$(".main > .body").css({
				"top": "44px",
				"height": $(".main").height()-$(".main > .title").outerHeight(true)-$(".menu").outerHeight(true)
			});
			notCondiitonBox = false;
			return;
		}

		$(".list > .action").scrollTop(0);

		var imgaeType = boxType.toLowerCase();
			imgaeType = imgaeType.split(",")[0];
		var targetTitle = '<div class="title"><div class="image" style="background: url(../image_mobile/icon38/'+imgaeType+'.svg) no-repeat center;" ></div><div class="goback">Go Back</div></div>';
		var boxList,
		 	boxBottomWrapper,
			boxWrapper,
			blockConditionBox;

		$(".list > .action").css("overflow", "hidden");	
		$(".main > .menu").hide();
		if(imgaeType == "loop" || imgaeType == "delay"){
			$(".loopAndDelayBlock:not(.dd-handle)").each(function(i, e){
				blockConditionBox = $(this).children().eq(1);
				boxWrapper = $(blockConditionBox).children();
				if($(blockConditionBox).css("display") != "none"){//지금 열려있는 conditionbox에 title 넣어줌
					$(boxWrapper).css({"height": "44px"});
					$(boxWrapper).before(targetTitle);//condition box title html 넣줌
					return false;//each의 break
				}
			});
		}
		else if(imgaeType != "break"){
			$("."+imgaeType+"Block:not(.dd-handle)").each(function(i, e){
				blockConditionBox = $(this).children().eq(1);
				boxWrapper = $(blockConditionBox).children().eq(0);
				boxBottomWrapper = $(blockConditionBox).children().eq(1);
				boxList = $(boxBottomWrapper).children().eq(0);
				if($(blockConditionBox).css("display") != "none"){//지금 열려있는 conditionbox에 title 넣어줌
					if(boxType == arr[6] || boxType == arr[7] || boxType == arr[10]){
						$(boxWrapper).css({"height": "44px"});
						$(boxBottomWrapper).css({"height": $(".main > .body").outerHeight(true) - 44});
						$(boxList).css({"height": $(boxBottomWrapper).outerHeight(true)});
					}
					$(boxWrapper).before(targetTitle);//condition box title html 넣줌

					if(boxType == arr[8] || boxType == arr[9]){
						$(boxBottomWrapper).css({"height": $(".main > .body").outerHeight(true) - 88});
						$(boxList).css({"height": $(boxBottomWrapper).outerHeight(true)});
					}
					else{//palette에 있는 block( loop , delay , math 제외)
						$(boxBottomWrapper).css({"height": $(".main > .body").outerHeight(true) - (44 + $(boxWrapper).outerHeight(true))});
						if($(boxWrapper).length > 2){
							$(boxBottomWrapper).css({"height": $(".main > .body").outerHeight(true) - (44 * $(".boxWrapper").length) - 88});
						}		
						$(boxList).css({"height": $(boxBottomWrapper).outerHeight(true)});
					}
					return false;//each의 break
				}
			});	
		}
	}

	function resizeConditionBox(event){
		console.log("(guiblockM.js)resize conditionbox handler in mobile");

		var boxList,
		 	boxBottomWrapper,
			boxWrapper,
			blockConditionBox;

		blockConditionBox = $(event).children(".blockConditionBox");
		boxWrapper = $(blockConditionBox).find(".boxWrapper");
		boxBottomWrapper = $(blockConditionBox).children().eq($(boxWrapper).length+1);
		boxList = $(boxBottomWrapper).children().eq(0);

		$(".list > .action").scrollTop(0);
		if($(blockConditionBox).parent().attr("class").split(" ")[0] == "ifBlock" || $(blockConditionBox).parent().attr("class").split(" ")[0] == "whileBlock"){
			for (var j = 0; j < $(boxWrapper).length; j++) {
				if( j > 0){
					$(boxWrapper[j]).children().eq(5).css({
						"float": "left"
					});
				}
				if( j < $(boxWrapper).length - 1 ){
					$(boxWrapper[j]).children().eq(6).hide();
					$(boxWrapper[j]).css({"height": "44px"});
				}
				else if( j == $(boxWrapper).length - 1 ){
					$(boxWrapper[j]).children().eq(6).show();
					$(boxWrapper[j]).css({"height": "88px"});
				}
			}
		}
		
		var boxBottomWrapperHeight = $(".main").outerHeight(true) - $(".title").outerHeight(true) - (44 * ($(boxWrapper).length+1));

		$(boxBottomWrapper).css({"height": boxBottomWrapperHeight });
		$(boxList).css({"height": $(boxBottomWrapper).outerHeight(true) });

		//boxWrapper가 88px가 아닌 경우
		if(($(boxWrapper).length == 1) && ($(boxWrapper).outerHeight(true) == 44)){
			$(boxList).css({"height": $(boxList).outerHeight(true) + 44});
		}

		if( boxBottomWrapperHeight <= 100){
			if($(blockConditionBox).css("overflow-y") != "auto"){
				$(blockConditionBox).css("overflow-y", "auto");
			}
			$(boxBottomWrapper).css({ 'height' : 255});
			$(boxList).css({ "height": $(boxBottomWrapper).outerHeight(true)});
		}

		if($(blockConditionBox).css("display") != "none"){
			$(".list > .action").css({"overflow": "hidden"});
		}
		else{
			$(".list > .action").css({"overflow": ""});
		}
	}

	function longClickDivStyle(element, elementFrom, eventName){
	    var li = element;
	    
	    if(eventName == "dragStart"){
	        li = element.children("li");
	    }

	    mapmoduleboxM.removeLongClickStyle();

	    if(elementFrom === "map"){
	        // map에서 module선택 시 테두리 생기게 
	        $(".dd-dragel").css({opacity : 1});
	        li.children(".image").addClass("imageOn");
	        li.children(".exit").show();
	    }
	    else if(elementFrom === "editor"){
	        var block = li.children(".block");
	        var blockWrapper = block.children(".blockWrapper");
	        var content = blockWrapper.children(".content");

	        block.addClass("blockOn");
	        block.children(".arrow").addClass("arrowOn");
	        blockWrapper.css("padding", "2px");
	        if($(li).attr("class").split(" ")[1] == "output"){
		    	blockWrapper.children(".image").css({
		    		"top": "2px",
		    		"left": "7px"
		    	});
		    	blockWrapper.children(".name").css("bottom", "4px");
		    }
	        content.addClass("contentOn");
	        content.children(".and").addClass("andOn");
	        content.children(".or").addClass("orOn");

	        block.children(".exit").show();
	        
	        if(block.children().eq(0).attr("class") != "exit"){
	            block.children().eq(0).css({
	                "margin-left": "",
	                "margin-top": ""
	            });
	            block.children().eq(0).css({
	                "margin-left": parseInt(block.children().eq(0).css('margin-left')) - 1,
	                "margin-top": parseInt(block.children().eq(0).css('margin-top')) - 1
	            });
	        }
	    }
	}

	function thenButtonhandler() {

	}

	return{
		setConditionBox: setConditionBox,
		resizeConditionBox: resizeConditionBox,
		longClickDivStyle: longClickDivStyle,
		arrSign: arrSign,
		thenButtonhandler: thenButtonhandler
	};
});