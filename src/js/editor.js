define(["jquery", "console", "guiblock", "nestable-sortable", "guiblockM", "cordova", "jquerycontextmenu"], function($, console, guiblock, nestable, guiblockM, cordova, jquerycontextmenu) {
	console.log("EDITOR INIT");

	var code;
	var clicked;

	var mathCount = 0;
	var numberCount = 0;
	var randomCount = 0;

	var editorCount = 0;

	var rightClicked;

	var editorHTML;
	var mapHTML;

	var nestableOptions = {
		group: 1,
		// maxDepth: 10000,
		// delay: 200,
		// listNodeName: 'ul',
		onDragStart: function(container, element) {
			$(".blockConditionBox").hide();
			if($(container).hasClass("palette")) {
				editorHTML = $(".editor .gui").html();
			} else if($(container).hasClass("mapBody")) {
				editorHTML = $(".editor .gui").html();
				mapHTML = $(".map .mapBody").html();
			}
		},
		callback: function(container, element, position) {
			var main = require('main');
			var plumb = require('plumb');
			if($(container).hasClass("action")) {
				main.pushUndo(1, "editor", editorHTML);
			} else if($(container).hasClass("mapBody")) {
				plumb.redrawAllConnections(plumb.mapInstance);
				$("#"+$(element).attr("id")).data("moved", true);
				main.pushUndo(1, "map", mapHTML);
			}
			addLogicToEditor(element, 0);
			guiblock.setRootNodeBackground(); 
			$($(".editor .dd-active:not(.off) .root .dd-item")[0]).before($(".editor .dd-active:not(.off) .root .tempList"));
	
			if(cordova.isCordova()){
				var className = container.attr("class").split(" ")[0];
				if(className != "palette" && className != "mapBody"){
					guiblockM.setConditionBox(element);
				}
			}
			
			if(element[0].className == "commentLogic dd-item") {
				var mouseX = event.clientX - 80 + $(".editor > .body .list div").scrollLeft();
				var mouseY = event.clientY - 56 + $(".editor > .body .list div").scrollTop();

				editorCount = $(".editor > .body > .list .gui .comment").length;

				if((event.clientX > 80 ) && (event.clientY > 56) && (event.clientX < 80+$(".main .body .editor .body .list .action .gui").width())) {
					console.log("event.clientX : event.clientY = "+event.clientX+" : "+event.clientY);
					$(".editor > .body > .list > .dd-active:not(.off) > .gui").append("<div class='comment comment"+editorCount+" dd-item'><div class='body'><textarea class='commentText' data-text=''></textarea></div><div class='title'><div class='text' data-langNum='134'>Comment</div><div class='exit'></div></div><div class='resize'></div></div>");
				}

				$(".editor > .body > .list > div > .gui > .comment").resizable({
					handles: 'se',
					minWidth: 160,
					minHeight: 100
				});

				console.log("mouseX: mouseY = "+mouseX+" : "+mouseY);
				$(".editor > .body > .list > div > .gui > .comment"+editorCount).css({
					"top": mouseY,
					"left": mouseX
				});

				$(".editor > .body > .list > div > .gui > .comment").draggable({
					handle: ".title",
					cancel: " .exit",
					revert: "invalid",
					stop: function(event, ui) {
						if(ui.position.top < 0) {
							$(event.target).css({
								top: 0
							});
						// } else if(ui.position.top+$(event.target).height() > $(".editor .gui").height()) {
						// 	$(event.target).css({
						// 		top: $(".editor .gui").height()-$(event.target).height()
						// 	});
						}

						if(ui.position.left < 0) {
							$(event.target).css({
								left: 0
							});
						// } else if(ui.position.left+$(event.target).width() > $(".editor").width()) {
						// 	$(event.target).css({
						// 		left: ui.position.left
						// 	});
						}
					}
				});

				$(".editor > .body > .list > div").droppable({});

				editorCount++;
			}

			$(".editor .list > .action").css({"overflow": "auto"});
			$(".editor .list > .action").on("mouseout", function() {
				$(this).css({"overflow" : "hidden"});
			});
			$(".editor .list > .action").on("mouseover", function() {
				$(this).css({"overflow" : "auto"});
			});

			// guiblock.setLanguage();
		}
	};

	function setNestable() {
		console.log("(editor.js)setNestable");
		$(".dd").nestable(nestableOptions);
	}


	/**
		add 'logic block'(items in palette) to editor
		element : element that from nestable
	*/
	function addLogicToEditor(element, idCount) {
		guiblock.hideAllConditionBox();
		if(element === undefined || element.hasClass("onEditor")) {
			return;
		}
		var maxlength = '';
		if(cordova.isCordova()){
			maxlength = 'maxlength="27"';
		}		

		var ifLogic = '<li id="block' + idCount + '" class="ifBlock off onEditor dd-item" data-id="block' + idCount + '" data-logic="if" data-code="if(condition)" data-annotation="false"> <div class="block ifBlock dd-handle"> <div class="blockBackground"> </div> <div class="exit"> </div> <div class="collapse"> </div> <div class="arrow"> </div> <div class="blockWrapper ifBlockWrapper"> <div class="image ifImage"> </div> <div class="content"> <div class="arr arr1"> <div class="icon"> </div> <div class="iconName"> </div> </div> <div class="arr arr1_1"> </div> <div class="arr arr2"> </div> <div class="arr arr3"> <div class="icon"> </div> <div class="iconName"> </div> </div> <div class="arr arr3_1"> </div> </div> </div> </div> \
		<div class="blockConditionBox basicBox" data-state="1" data-save-what="" data-save-arr2="" data-save-data="" data-what="" data-arr2="" data-data=""> \
		<div class="boxWrapper" data-id="box1" data-state="1" data-arr1ismodule="false" data-arr3ismodule="false" data-andor="And" data-arr1="null" data-arr1_1="null" data-arr2="null" data-arr3="null" data-arr3_1="null" data-selectedtype=""> <div class="arr boxType"> IF </div> <div class="arr arr1"> <input type="text" class="textBox" placeholder="What"> </div> <div class="arr is"> is </div> <div class="arr arr2"> <input type="text" class="buttonBox signBox" placeholder="-"> </div> <div class="arr arr3"> <input type="text" class="textBox" placeholder="Data(0~100%)"> </div> <div class="arr plus"> <div class="image"> </div> </div> <div class="arr then"> <div> Then </div> </div> </div> <div class="boxBottomWrapper"> <div class="boxList"> <div class="listGradation"> </div> </div> \
		<div class="boxHelp"> \
		<div class="body" style="width: 380px; background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"> <div class="text" style="width: 340px;" data-langNum="268"> Please enter function on the blank above manually or choose from lists on left column </div> </div> </div> </div> </div> </li>';
		var whileLogic = '<li id="block' + idCount + '" class="whileBlock off onEditor dd-item" data-id="block' + idCount + '" data-logic="while" data-code="while(condition)" data-annotation="false"> <div class="block whileBlock dd-handle"> <div class="blockBackground"> </div> <div class="exit"> </div> <div class="collapse"> </div> <div class="arrow"> </div> <div class="blockWrapper whileBlockWrapper"> <div class="image whileImage"> </div> <div class="content"> <div class="arr arr1"> <div class="icon"> </div> <div class="iconName"> </div> </div> <div class="arr arr1_1"> </div> <div class="arr arr2"> </div> <div class="arr arr3"> <div class="icon"> </div> <div class="iconName"> </div> </div> <div class="arr arr3_1"> </div> </div> </div> </div> \
		<div class="blockConditionBox basicBox" data-state="1" data-save-what="" data-save-arr2="" data-save-data="" data-what="" data-arr2="" data-data=""> \
		<div class="boxWrapper" data-id="box1" data-state="1" data-arr1ismodule="false" data-arr3ismodule="false" data-andor="And" data-arr1="null" data-arr1_1="null" data-arr2="null" data-arr3="null" data-arr3_1="null" data-selectedtype=""> <div class="arr boxType"> While </div> <div class="arr arr1"> <input type="text" class="textBox" placeholder="What"> </div> <div class="arr is"> is </div> <div class="arr arr2"> <input type="text" class="buttonBox signBox" placeholder="-"> </div> <div class="arr arr3"> <input type="text" class="textBox" placeholder="Data(0~100%)"> </div> <div class="arr plus"> <div class="image"> </div> </div> <div class="arr then"> <div> Then </div> </div> </div> <div class="boxBottomWrapper"> <div class="boxList"> <div class="listGradation"> </div> </div> \
		<div class="boxHelp"> \
		<div class="body" style="width: 380px; background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"> <div class="text" style="width: 340px;" data-langNum="267"> Please enter function on the blank above manually or choose from lists on left column </div> </div> </div> </div> </div> </li>';
		var loopLogic = '<li id="block' + idCount + '" class="loopAndDelayBlock off onEditor dd-item" data-id="block' + idCount + '" data-logic="loop" data-code="loop(10)" data-annotation="false"> <div class="block loopAndDelayBlock dd-handle"> <div class="exit"> </div> <div class="collapse"> </div> <div class="arrow"> </div> <div class="blockWrapper"> <div class="image loopImage"> </div> <div class="content"> <div class="loopAndDelayArr loopAndDelayArr1 loopArr1"> </div> <div class="loopAndDelayArr loopAndDelayArr2 loopArr2"> </div> </div> </div> </div> \
		<div class="blockConditionBox basicBox" data-save-num="" data-num=""> \
		<div class="boxWrapper" data-id="box1" data-times> <div class="arr boxType"> Loop </div> <div class="arr loopAndDelayArr loopAndDelayArr1"> <input type="text" class="textBox" placeholder="00"> </div> <div class="loopAndDelayArr loopAndDelayTimes" data-langNum="144"> times </div> <div class="loopAndDelayArr loopAndDelayOk ok"> <div data-langNum="148"> OK </div> </div> </div> </div> </li>';
		var breakLogic = '<li id="block' + idCount + '" class="breakBlock off onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="break" data-code="break;" data-annotation="false"> <div class="block breakBlock dd-handle"> <div class="breakBlockBackground"> </div> <div class="exit"> </div> <div class="blockWrapper"> <div class="image breakImage"> </div> <div class="content"> <div class="arr arr1"> <div class="icon"> </div> <div class="iconName"> </div> </div> <div class="arr arr1_1"> </div> <div class="arr arr2"> </div> <div class="arr arr3"> <div class="icon"> </div> <div class="iconName"> </div> </div> <div class="arr arr3_1"> </div> </div> </div> </div> </div> </div> <div class="boxHelp"> </div> </div> </div> </li>';
		var mathLogic = '<li id="block' + idCount + '" class="mathBlock off onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="math" data-code=" = ;" data-annotation="false"> <div class="block mathBlock dd-handle"> <div class="blockBackground"> </div> <div class="exit"> </div> <div class="blockWrapper mathBlockWrapper"> <div class="image mathImage"> </div> <div class="content"> </div> </div> </div> \
		<div class="blockConditionBox basicBox" data-state="1" data-save-variable="" data-save-formular="" data-variable="" data-formular=""> \
		<div class="boxWrapper" data-id="box1" data-state="1" data-arr1ismodule="false" data-arr3ismodule="false" data-andor="And" data-arr1="null" data-arr1_1="null" data-arr2="null" data-arr3="null" data-arr3_1="null"> <div class="arr mathBoxVariable"> <input type="text" class="textVariableBox"> </div> <div class="arr equal"> = </div> <div class="arr formular"> <input type="text" class="textBox" placeholder="What"> </div> <div class="arr ok"> <div data-langNum="148"> OK </div> </div> </div> <div class="boxBottomWrapper"> <div class="boxMathPanel"> <table class="mathTable"> <tbody> <tr> <td class="mathPanelLeftButtons" data-val="7"> 7 </td> <td class="mathPanelLeftButtons" data-val="8"> 8 </td> <td class="mathPanelLeftButtons" data-val="9"> 9 </td> <td class="mathPanelRightButtons mathDivide" data-val="/"> <div class="mathButtonBackground"> </div> </td> </tr> <tr> <td class="mathPanelLeftButtons" data-val="4"> 4 </td> <td class="mathPanelLeftButtons" data-val="5"> 5 </td> <td class="mathPanelLeftButtons" data-val="6"> 6 </td> <td class="mathPanelRightButtons mathMulti" data-val="*"> <div class="mathButtonBackground"> </div> </td> </tr> <tr> <td class="mathPanelLeftButtons" data-val="1"> 1 </td> <td class="mathPanelLeftButtons" data-val="2"> 2 </td> <td class="mathPanelLeftButtons" data-val="3"> 3 </td> <td class="mathPanelRightButtons mathPlus" data-val="+"> <div class="mathButtonBackground"> </div> </td> </tr> <tr> <td class="mathPanelLeftButtons mathBackspace" data-val="b"> <div class="mathButtonBackground"> </div> </td> <td class="mathPanelLeftButtons math0" data-val="0"> 0 </td> <td class="mathPanelLeftButtons mathDot" data-val="."> . </td> <td class="mathPanelRightButtons mathMinus" data-val="-"> <div class="mathButtonBackground"> </div> </td> </tr> </tbody> </table> </div> <div class="boxList"> <div class="listGradation"> </div> </div> </div> </div> </li>';
		var delayLogic = '<li id="block' + idCount + '" class="loopAndDelayBlock off onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="delay" data-code="Sleep(10);" data-annotation="false"> <div class="block loopAndDelayBlock dd-handle"> <div class="exit"> </div> <div class="blockWrapper"> <div class="image delayImage"> </div> <div class="content"> <div class="loopAndDelayArr loopAndDelayArr1 delayArr1"> </div> <div class="loopAndDelayArr loopAndDelayArr2 delayArr2"> </div> </div> </div> </div>\
		<div class="blockConditionBox basicBox" data-save-num="" data-num="">\
		<div class="boxWrapper" data-id="box1" data-times> <div class="arr boxType"> Delay </div> <div class="arr loopAndDelayArr loopAndDelayArr1"> <input type="text" class="textBox" placeholder="00"> </div> <div class="loopAndDelayArr loopAndDelayTimes" data-langNum="145"> ms </div> <div class="loopAndDelayArr loopAndDelayOk ok"> <div data-langNum="148"> OK </div> </div> </div> </div> </li>';
		var customLogic = '';
		var commentLogic = '';

		var number = ' <li id="block' + idCount + '" class="numberBlock off onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="number" data-code="int ' + $(element).attr("id") + ' = 0;" data-annotation="false"> <div class="block numberBlock dd-handle"> <div class="exit"> </div> <div class="blockWrapper"> <div class="image numberImage"> </div> <div class="content"> <div class="numberId">' + $(element).attr("id") + '</div> <div class="numberEqual"> </div> <div class="numberText"> </div> </div> </div> </div> \
		<div class="blockConditionBox basicBox" data-save-number="" data-number=""> \
		<div class="boxWrapper" data-id="box1" data-times> <div class="arr boxType">' + $(element).attr("id") + '</div> <div class="arr numberArr numberArr1"> <input type="text" class="textBox" placeholder="0"> </div> <div class="numberArr numberOk ok"> <div data-langNum="148"> OK </div> </div> </div> </div> </li>';
		var random = '<li id="block' + idCount + '" class="randomBlock off onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="random" data-code="' + $(element).attr("id") + ' = random(0, 10);" data-annotation="false"> <div class="block randomBlock dd-handle"> <div class="exit"> </div> <div class="blockWrapper"> <div class="image randomImage"> </div> <div class="content"> <div class="arr randomMin"> </div> <div class="arr randomBelow"> </div> <div class="arr randomVariable">' + $(element).attr("id") + '</div> <div class="arr randomBelow"> </div> <div class="arr randomMax"> </div> </div> </div> </div>\
		<div class="blockConditionBox basicBox" data-save-min="" data-save-max="" data-min="" data-max="">\
		<div class="boxWrapper" data-id="box1"> <div class="arr randomBoxVariable">' + $(element).attr("id") + '</div> <div class="arr randomText" data-langNum="142"> min </div> <div class="arr randomMin"> <input type="text" class="textBox" placeholder="00"> </div> <div class="arr randomTilde"> ~ </div> <div class="arr randomText" data-langNum="143"> max </div> <div class="arr randomMax"> <input type="text" class="textBox" placeholder="00"> </div> <div class="arr randomOk ok"> <div data-langNum="140"> OK </div> </div> </div> </div> </li>';
		var motor = '<li id="block' + idCount + '" class="motorBlock output onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="motor" data-code="' + $(element).attr("id") + '.set_(,);" data-annotation="false"> <div class="block motorBlock dd-handle"> <div class="exit"> </div> <div class="blockWrapper motorBlockWrapper"> <div class="image motorImage"> </div> <div class="name">' + element.data("name") + '</div> <div class="content"> <div class="arr moduleArr"> </div> </div> </div> </div>\
		<div class="blockConditionBox basicBox" data-state="motor1" data-save-property="" data-save-upper="" data-save-bottom="" data-property="" data-upper="" data-bottom="">\
		<div class="boxWrapper outputBlock" data-id="box1" data-state="1" data-arr1ismodule="false" data-arr3ismodule="false" data-andor="And" data-arr1="null" data-arr1_1="null" data-arr2="null" data-arr3="null" data-arr3_1="null"> <div class="arr boxType"> </div> <div class="arr name">' + element.data("name") + ' &#39;s</div> <div class="arr property"> <input type="text" class="textBox" placeholder="property"> </div> <div class="arr upper"> <input type="text" class="textBox" placeholder="upper"> </div> <div class="arr bottom"> <input type="text" class="textBox" placeholder="bottom"> </div> <div class="arr ok" style="float: right;"> <div data-langNum="148"> OK </div> </div> </div> <div class="boxBottomWrapper"> <div class="boxList"> <div class="listGradation"> </div> </div>\
		<div class="boxHelp"> \
		<div class="body" style="width: 350px; background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"> <div class="text" style="width: 310px;" data-langNum="266"> Please enter function on the blank above manually or choose from lists on left column </div> </div> </div> </div> </div> </div> </li>';
		var led = '<li id="block' + idCount + '" class="ledBlock output onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="led" data-code="' + $(element).attr("id") + '.set_rgb(NaN,NaN,NaN);" data-annotation="false"> <div class="block ledBlock dd-handle"> <div class="exit"> </div> <div class="blockWrapper ledBlockWrapper"> <div class="image ledImage"> </div> <div class="name">' + element.data("name") + '</div> <div class="content"> <div class="arr moduleArr"> </div> </div> </div> </div>\
		<div class="blockConditionBox basicBox" data-state="led" data-save-what="" data-save-red="" data-save-green="" data-save-blue="" data-color="" data-red="" data-green="" data-blue="">\
		<div class="boxWrapper outputBlock" data-id="box1" data-state="1" data-arr1ismodule="false" data-arr3ismodule="false" data-andor="And" data-arr1="null" data-arr1_1="null" data-arr2="null" data-arr3="null" data-arr3_1="null"><div class="arr boxType"></div><div class="arr name">' + element.data("name") + ' &#39;s</div><div class="arr color"><input type="text" class="textBox" placeholder="what"></div><div class="arr rgb red"><input type="text" class="textBox" placeholder="red"></div><div class="arr rgb green"><input type="text" class="textBox" placeholder="green"></div><div class="arr rgb blue"><input type="text" class="textBox" placeholder="blue"></div><div class="arr ok" style="float: right;"><div data-langNum="148">OK</div></div></div><div class="boxBottomWrapper"><div class="boxList"><div class="listGradation"></div></div>\
		<div class="boxHelp"> \
		<div class="body" style="width: 430px; background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"> <div class="text" style="width: 390px;" data-langNum="265"> Please enter function on the blank above manually or choose from lists on left column </div> </div> </div> </div> </div> </div> </li>';
		var speaker = '<li id="block' + idCount + '" class="speakerBlock output onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="speaker" data-code="' + $(element).attr("id") + '.set_tune(,);" data-annotation="false"> <div class="block speakerBlock dd-handle"> <div class="exit"> </div> <div class="blockWrapper speakerBlockWrapper"> <div class="image speakerImage"> </div> <div class="name">' + element.data("name") + '</div> <div class="content"> <div class="arr moduleArr"> </div> </div> </div> </div> \
		<div class="blockConditionBox basicBox" data-state="speaker" data-save-what="" data-save-frequency="" data-save-volume="" data-what="" data-frequency="" data-volume=""> \
		<div class="boxWrapper outputBlock" data-id="box1" data-state="1" data-arr1ismodule="false" data-arr3ismodule="false" data-andor="And" data-arr1="null" data-arr1_1="null" data-arr2="null" data-arr3="null" data-arr3_1="null"> <div class="arr boxType"> </div> <div class="arr name">' + element.data("name") + ' &#39;s</div> <div class="arr what"> <input type="text" class="textBox" placeholder="what"> </div> <div class="arr frequency"> <input type="text" class="textBox" placeholder="frequency"> </div> <div class="arr volume"> <input type="text" class="textBox" placeholder="volume"> </div> <div class="arr ok" style="float: right;"> <div data-langNum="148"> OK </div> </div> </div> <div class="boxBottomWrapper"> <div class="boxList"> <div class="listGradation"> </div> </div> \
		<div class="boxHelp"> \
		<div class="body" style="width: 350px; background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"> <div class="text" style="width: 310px;" data-langNum="264"> Please enter function on the blank above manually or choose from lists on left column </div> </div> </div> </div> </div> </li>';
		var display = '<li id="block' + idCount + '" class="displayBlock output onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="display" data-code="' + $(element).attr("id") + '.set_display_();" data-annotation="false"> <div class="block displayBlock dd-handle"> <div class="exit"> </div> <div class="blockWrapper displayBlockWrapper"> <div class="image displayImage"> </div> <div class="name">' + element.data("name") + '</div> <div class="content"> <div class="arr moduleArr"> </div> </div> </div> </div> \
		<div class="blockConditionBox basicBox" data-state="display" data-save-what="" data-what="" data-save-text="" data-text="" data-save-drawing-text="" data-drawing-text="" data-save-drawing="" data-drawing="null"> \
		<div class="boxWrapper outputBlock" data-id="box1" data-state="1" data-arr1ismodule="false" data-arr3ismodule="false" data-andor="And" data-arr1="null" data-arr1_1="null" data-arr2="null" data-arr3="null" data-arr3_1="null"> <div class="arr boxType"> </div> <div class="arr name">' + element.data("name") + ' &#39;s</div> <div class="arr what"> <input type="text" class="textBox" placeholder="what"> </div> <div class="arr data"> <input type="text" class="textBox" placeholder="data"'+maxlength+'> </div> <div class="arr ok" style="float: right;"> <div data-langNum="148"> OK </div> </div> </div> <div class="boxBottomWrapper"> <div class="boxList"> <div class="listGradation"> </div> </div> \
		<div class="boxHelp" data-pen-size="3" data-erase-size="3"> \
		<div class="body" style="width: 320px; height: 192px; background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"> <div class="text" style="width: 280px;" data-langNum="263"> Please enter function on the blank above manually or choose from lists on left column </div> </div> </div> </div> </div> </li>';
		
		var usb = '<li id="block' + idCount + '" class="usbBlock output onEditor dd-item dd-nochildren" data-id="block' + idCount + '" data-logic="usb" data-annotation="false"> <div class="block usbBlock dd-handle"> <div class="exit"> </div> <div class="blockWrapper usbBlockWrapper"> <div class="image usbImage"> </div> <div class="name">' + element.data("name") + '</div> <div class="content"> <div class="arr moduleArr"> </div> </div> </div> </div> \
		<div class="blockConditionBox basicBox" data-state="usb"> \
		<div class="boxWrapper outputBlock" data-id="box1" data-state="1" data-arr1ismodule="false" data-arr3ismodule="false" data-andor="And" data-arr1="null" data-arr1_1="null" data-arr2="null" data-arr3="null" data-arr3_1="null"> <div class="arr boxType"> </div> <div class="arr name">' + element.data("name") + ' &#39;s</div> <div class="arr what"> <input type="text" class="textBox" placeholder="what"> </div> <div class="arr usbdata"> <input type="text" class="textBox" placeholder="data"> </div> <div class="arr ok" style="float: right;"> <div data-langNum="148"> OK </div> </div> </div> <div class="boxBottomWrapper"> <div class="boxList"> <div class="listGradation"> </div> </div> \
		<div class="boxHelp"> \
		<div class="body" style="width: 350px; background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"> <div class="text" style="width: 310px;" data-langNum="141"> Please enter function on the blank above manually or choose from lists on left column </div> </div> </div> </div> </div> </li>';

		var table = {
			"ifLogic": ifLogic,
			"whileLogic": whileLogic,
			"loopLogic": loopLogic,
			"breakLogic": breakLogic,
			"mathLogic": mathLogic,
			"delayLogic": delayLogic,
			"customLogic": customLogic,
			"commentLogic": commentLogic,

			"number": number,
			"random": random,
			"motor": motor,
			"led": led,
			"speaker": speaker,
			"display": display,
			"usb": usb
		};
		var obj;
		if(element.hasClass("module")) {
			console.log("hasClass module");
			obj = element.attr("class").split(/\s+/)[1];
		}
		else {
			console.log("hasNotClass module");
			obj = element[0].getAttribute("class");
		}

		obj = obj.replace(' dd-item', '');

		if(table[obj] === undefined) {
			element.remove();
			return;
		}

		var elem = $(table[obj]);
		if(element.closest(".onEditor").data("annotation") === true) {
			elem.attr("data-annotation", true);
			elem.data("annotation", true);
			elem.find(".block").attr("data-annotation", true);
			elem.find(".block").data("annotation", true);
		}
		$(element[0]).replaceWith(elem);

		$(".delete").on("click", function(event) {
			$(this).parent().parent().remove();
		});
	}

	function serialize() {
		var serial = [];

		$(".dd.action").each(function(itr) {
			serial.push({
				id: $(this).attr("id"),
				serial: $(this).nestable("serialize")
			});
		});

		return serial;
	}

	function copy(elem) {
		var clone = elem.clone();
		clone.find("> .dd-handle").removeClass("context-menu-active");
		elem.after(clone);
	}

	function expand(elem) {
		elem.children("ul").css({
			'height': '',
			'overflow-y': ''
		});
		elem.children(".block").find(".collapse").css({
			'display': 'none'
		});
	}

	function collapse(elem) {
		elem.children("ul").css({
			'height': 0,
			'overflow-y': 'hidden'
		});
		elem.children(".block").find(".collapse").css({
			'display': 'initial'
		});
	}

	function annotation(elem) {
		if(elem.data("annotation") === true) {
			elem.attr("data-annotation", false);
			elem.data("annotation", false);
			elem.find(".onEditor").each(function(itr) {
				$(this).attr("data-annotation", false);
				$(this).data("annotation", false);
			});
			elem.find(".block").each(function(itr) {
				$(this).attr("data-annotation", false);
				$(this).data("annotation", false);
			});
		} else {
			elem.attr("data-annotation", true);
			elem.data("annotation", true);
			elem.find(".onEditor").each(function(itr) {
				$(this).attr("data-annotation", true);
				$(this).data("annotation", true);
			});
			elem.find(".block").each(function(itr) {
				$(this).attr("data-annotation", true);
				$(this).data("annotation", true);
			});
		}
	}

	function setContextMenu() {
		$.contextMenu({
			selector: '.dd-list > li.onEditor > .dd-handle',
			events: {
				show: function(options) {
					console.log("context menu show");

					var hideall = require("hideall");

					editorHTML = $(".editor .gui").html();
					hideall.hideMenubox();
					hideall.hideConditionbox();
				},
				hide: function(options) {
					console.log("context menu hide");
				}
			},
			callback: function(key, options) {
				var main = require('main');
				var elem = options.$trigger.parent();
				if(key == "copy") {
					copy(elem);
				} else if(key == "expand") {
					expand(elem);
				} else if(key == "collapse") {
					collapse(elem);
				} else if(key == "annotation") {
					annotation(elem);
				}
				main.pushUndo(1, "editor", editorHTML);
			},
			items: {
				"annotation": {
					name: "Annotation",
					icon: "annotation"
				},
				"collapse": {
					name: "Collapse",
					icon: "collapse"
				},
				"expand": {
					name: "Expand",
					icon: "expand"
				},
				"copy": {
					name: "Copy",
					icon: "copy"
				}
			}
		});

		$("body .context-menu-list.context-menu-root").css({
			"width" : "120px",
			"height" : "112px",
			"font-size" : "12px",
			"min-width" : "0",
			"min-height" : "0",
			"padding" : "0"
		});

		$(".context-menu-item.context-menu-icon > span").css({
			"width" : "120px"
		});

		$(".context-menu-item").css({
			"width" : "120px",
			"height" : "28px",
			"padding" : "0 0 0 32px",
			"line-height" : "28px",
			"box-sizing" : "border-box"
		});
	}

	$(document).ready(function() {
		setContextMenu();
	});

	return {
		setNestable: setNestable,
		serialize: serialize
	};
});