define(['jquery', "console", 'jqueryui', 'slidepro', 'project', 'cordova', 'modalM', 'electron'], function($, console, ui, slide, project, cordova, modalM, electron) {
	console.log("MODAL INIT");

	var prevState = ".main";
 
	var arrowFlag = false;

	var nArrowFlag = false;
	var nLength = 0;

	function gettingStartHandler(event) {
		console.log("(modal.js)getting start handler");
		
		if(cordova.isCordova()){
			modalM.hoverEvent(event);
			if(event.type == 'touchstart'){
				return;
			}
			event.preventDefault();
		}

		openModal(".gettingproject");	
		
		event.stopPropagation();
	}

	function resettingNewProjectList(cb){
		requirejs(["daemon"], function(daemon){
			var lists = daemon.getConnectedNetworkModule();			
			resetNewprojectItem();
			addNewprojectItem("TEST Network Module");
			// for(var i = 0; i < 100; i++) {
			// 	var text = "TEST Network Module" + i;
			// 	addNewprojectItem(text);
			// }
			lists.forEach(function(item){
				addNewprojectItem(item);
			});
			cb();
		});
	}

	function newProjectHandler(event) {
		console.log("(modal.js)new project handler");
		
		if(cordova.isCordova()){
			modalM.hoverEvent(event);
			if(event.type == "touchstart"){
				return;
			}
			$(".modal > .newproject > .body > .button").css({ 
			    "border": "1px solid #d1d1d1",
			    "background": "rgb(255, 255, 255)",
			    "color": "rgb(209, 209, 209)"
			});
			$(".modal > .newproject > .body > .text").css("bottom", $(".modal > .newproject > .body > .buttonBackground").outerHeight(true));
			if($(".switch").hasClass("checked")){
				$(".switch").removeClass("checked");
				$(".bluetooth > .switchBtn").stop().animate({"backgroundColor": "#bcbcbc"}, 380);
			}
		}
		resettingNewProjectList(function(){
			openModal(".newproject");
		});
		if(cordova.isCordova()){
			event.preventDefault();
		}
		event.stopPropagation();
	}

	function recentProjectHandler(event) {
		console.log("(modal.js)recent project handler");
		if($(event.target).find(".name").text() !== "None") {
			openProjectHandler(event);
		}
		event.stopPropagation();
	}

	function openAsHandler(event) {
		console.log("(mdoal.js)open as handler");
		var target = event.currentTarget.className.split(" ")[0];
		if(cordova.isCordova()){
			modalM.hoverEvent(event);
			if(event.type == 'touchstart'){
				return;
			}
		}
		
		openModal(".openproject");			
		setSieveOpenproject();

		if(cordova.isCordova()){
			event.preventDefault();
		}

		event.stopPropagation();
	}

	function beforeOpenprojectHandler(event) {
		console.log("(mdoal.js)before Openproject handler");
		openModal(".beforeOpenproject");
		event.stopPropagation();
	}
	
	function closeModalHandler(event) {
		console.log("(modal.js)close modal handler");	
		if(cordova.isCordova()){
			if($(event.target).attr("class") == "cancel"){
				$(this).toggleClass("clickCancel");
			}
			else{
		        $(this).toggleClass("clickExit");
			}
	        if(event.type == "touchstart"){
				return;
			}
		}

		event.preventDefault();
		closeModal();

		event.stopPropagation();
	}

	function goBackHandler(event) {
		console.log("(modal.js)go back handler");
		if(cordova.isCordova()){
	        $(this).toggleClass("clickGoback");
	        if(event.type == "touchstart"){
				return;
			}
			$(".modal > .newproject > .body > .button").css({ 
			    "border": "1px solid #d1d1d1",
			    "background": "rgb(255, 255, 255)",
			    "color": "rgb(209, 209, 209)"
			});
			$(".modal > .newproject > .body > .text").css("bottom", $(".modal > .newproject > .body > .buttonBackground").outerHeight(true));
			if($(".switch").hasClass("checked")){
				$(".switch").removeClass("checked");
				$(".bluetooth > .switchBtn").stop().animate({"backgroundColor": "#bcbcbc"}, 380);
			}
		}

		if($(this).parent().parent().hasClass("newproject")) {
			$(".modal .newproject .body .existText").css({"display" : "none"});
		}
		if(prevState === "") {
			closeModal();
		}
		else {
			openModal(prevState);
		}
		
		if(cordova.isCordova()){
			event.preventDefault();
		}
		
		event.stopPropagation();
	}

	// return projectname and selected network module uuid
	function getSelectItemByCreateProject(){
		var name = $($(".modal .newproject .body .inputText")[1]).val();
		
		var liCount = $(".modal .newproject li.item").length / 2;
		var itemName;
		for(i = 0; i < liCount; i++ ) {
			if($(".modal .newproject li.item").eq(liCount+i).hasClass("click")) {
				itemName = $(".modal .newproject li.item").eq(liCount+i).find(".name").text();
				break;
			}
		}

		return [name, itemName];
	}

	function createProjectHandler(event) {
		console.log("(modal.js)create project handler");
		
		var inputValue = $(".modal .newproject > .body > .inputText")[1].value;

		var liCountOpenas = $(".modal .openproject ul .item .name").length /2;
		var countMatch = 0;

		var arrPickedColor = [
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)"
		];

		if( inputValue !== "" && inputValue !== undefined && $(".modal .newproject .item").hasClass("click")) {
			if(cordova.isCordova()){
				modalM.hoverEvent(event);
				if(event.type == 'touchstart'){
					return;
				}
			}
		
			if(!electron.isProjectExist(inputValue)) {
				$(".modal .newproject .body .existText").css({"display" : "none"});

				console.log("(modal.js) create project");

				project.close();
				closeModal();
				
				var file = require('file');
				var daemon = require('daemon');
				var connect_ = daemon.getConnect();

				// project.init("always");
				project.init();

				var arr = getSelectItemByCreateProject();
				var name = arr[0];
				var networkuuid = arr[1];
				// var port = connect_[networkuuid].port;

				createProject(name, networkuuid, function(){
					file.saveProject(name, project.save(), function(bSuccess){});
					closeModal();
					// var menubox = require('menubox');
					// menubox.startPeriodicalSave();
					// daemon.send2Daemon(daemon.requestAllTopology(port));

					var guiblock = require('guiblock');
					guiblock.setArrPickedColor(arrPickedColor);
				});
				
				var init = require('init');

				init.setDiv(65);

				if(event) {
					event.stopPropagation();
				}
			} else if(electron.isProjectExist(inputValue)) {
				$(".modal .newproject .body .existText").css({"display" : "block"});
			}

			if(cordova.isCordova()){
				event.preventDefault();
			}
		}
	}
	
	function enterHandler(event) {
		if(event.keyCode == 13) {		// enter
			console.log("(modal.js)enter pressed handler.");
			createProjectHandler();
		}
	}

	function createProject(name, networkuuid, cb){
		var file = require('file');
		var map = require('map');

		file.createProject(name, project.save(), function(bSuccess){
			if (bSuccess){					
				setTitleName(name);
				$(".modal .newproject .body input").val("");
				requirejs(['daemon'], function(daemon){
					var bLive = true;
					if (networkuuid == "TEST Network Module"){
						bLive = false;
					}
					// for(var i = 0; i < 100; i ++) {
					// 	var text = "TEST Network Module" + i;
					// 	if (networkuuid == text){
					// 		bLive = false;
					// 	}
					// }
					map.toggleLiveModuleMap(bLive);
					daemon.reconnectAllModules(networkuuid);
					cb();
				});
			}
		});
	}

	function openProjectHandler(event) {
		console.log("(modal.js)open project handler");

		var file = require('file');
		var map = require('map');
		var clickItem;

		if(cordova.isCordova()){
			modalM.hoverEvent(event);
			if(event.type == 'touchstart'){
				return;
			}
		}
		
		if($(event.target).css("border-color") == "rgb(38, 202, 211)" || event.type == "dblclick" || $(event.target).is(".project1, .project2, .project3, .project1 div, .project2 div, .project3 div")) {
			if($(event.target).hasClass("item")) {
				clickItem = $(event.target);
			} else if($(event.target).hasClass("button")) {
				clickItem = $(event.target).parents(".body").find(".item.click");
			} else if($(event.target).hasClass("name")) {
				clickItem = $(event.target).parent();
			}
			var projectName = clickItem.find(".name").text();
			var currentProjectName = $(".title .titleName").text();
			file.saveProject(currentProjectName, project.save(), function(bSuccess){
				console.log("save result: "+bSuccess);
				if (bSuccess){
					var cui = require('cui');
					file.openProject(projectName, function(data){
						project.close();
						project.open(data);
						map.toggleLiveModuleMap(true);
						var uuids = project.getNetworkModuleUUIDs();
						requirejs(['daemon'], function(daemon){	
							// uuids.forEach(function(uuid){
							// 	daemon.reconnectAllModules(uuid);
							// });
							daemon.reconnectAllModules();
							closeModal();
							var menubox = require('menubox');
							// menubox.startPeriodicalSave();
						});
						file.saveRecentFile(projectName, function(bSuccess) {
							console.log("recent file save result: "+bSuccess);
						});
					});

					cui.createAceAction();

				}			
			});
			buttonInactivation(".openproject", ".button");
		}
		if(cordova.isCordova()){
			event.preventDefault();
		}
		event.stopPropagation();
	}

	function setSieveOpenproject() {
		console.log("(modal.js)set sieve on .inputText in open project ");
		var sieveOptions = {
			searchTemplate: $($(".modal .openproject")[1]).find(".inputText"),
			itemSelector: ".item"
		};

		$(".modal .openproject .file").sieve(sieveOptions);
		$(".modal .openproject .inputText").find("input").attr("tabindex", "-1");
	}

	function newProjectItemHandler(event) {
		console.log("(modal.js)new project item handler");

		$(this).toggleClass("click");

		event.stopPropagation();
	}

	function openProjectItemHandler(event) {
		console.log("(modal.js)open project item handler");

		$(this).toggleClass("click");
		if($(this).hasClass("click")) {
			buttonActivation(".openproject", ".button");
		} else if(!$(this).hasClass("click")) {
			buttonInactivation(".openproject", ".button");
		}
		$(this).parent().find(".item").not(this).removeClass("click");
		event.stopPropagation();
	}

	function deleteProjectItemHandler(event) {
		console.log("(modal.js)delete project item handler");

		var file = require('file');
		var name = $(event.target).closest(".item").find(".name").text();
		file.deleteProject(name);
		file.deleteRecentProject(name, function(bSuccess) {
			console.log("delete result: "+bSuccess);
		});
		$(event.target).closest(".item").remove();

		event.stopPropagation();
	}

	function keypressHandler(event) {
		/**
			opened modal is closed when esc clicked.
		*/
		if(event.keyCode == 27) {
			console.log("(modal.js)ESC pressed");

			var onModal;
			$(event.currentTarget).find(".window").each(function(event) {
				if($(this).css("display") != "none") {
					// onModal = $(this);
					closeModal(); // 인자없이 모든 모달 제거 됨
				}
			});
		}
	}

	function closeModal(event) {
		// console.log(event); 
		// $(event.currentTarget).parents(".window").remove();
		closeUpload();
		$(".modal").css({"display": "none"});
		prevState = "";
	}

	function setModalPosition(modalSelector) {
		var centerX = ($("body").width() - $(".modal " + modalSelector).width()) / 2;
		var centerY = ($("body").height() - $(".modal " + modalSelector).height()) / 2;

		$(".modal " + modalSelector).css({"left": centerX, "top": centerY});
	}

	function openModal(modalSelector) {
		var file = require('file');

		$($(".modal " + modalSelector)[1]).remove();
		var modal;
		var centerX = ($("body").width() - $(".modal " + modalSelector).width()) / 2;
		var centerY = ($("body").height() - $(".modal " + modalSelector).height()) / 2;
		$(".modal").css({"display": "block"});
		$(".modal > div:not(.background)").css({"display": "none"});
		if(modalSelector == ".main") {
			if(electron.isElectron()) {
				console.log("set left, height on .modal .main in electron");
				file.openRecentFile(function(data) {
					console.log(data);
					json = JSON.parse(data);
					if(json["1"]) {
						// $(".modal .main .project1 .image").attr("src", electron.getThumbnail(json["1"]));
						electron.getThumbnail(json["1"], function(data) {
							$(".modal .main .project1 .image").attr("src", data);
							$(".modal .main .project1 .name").text(json["1"]);
						});
					} else {
						$(".modal .main .project1 .image").attr("src", "");
						$(".modal .main .project1 .name").text("None");
					}
					if(json["2"]) {
						// $(".modal .main .project2 .image").attr("src", electron.getThumbnail(json["2"]));
						electron.getThumbnail(json["2"], function(data) {
							$(".modal .main .project2 .image").attr("src", data);
							$(".modal .main .project2 .name").text(json["2"]);
						});
					} else {
						$(".modal .main .project2 .image").attr("src", "");
						$(".modal .main .project2 .name").text("None");
					}
					if(json["3"]) {
						// $(".modal .main .project3 .image").attr("src", electron.getThumbnail(json["3"]));
						electron.getThumbnail(json["3"], function(data) {
							$(".modal .main .project3 .image").attr("src", data);
							$(".modal .main .project3 .name").text(json["3"]);
						});
					} else {
						$(".modal .main .project3 .image").attr("src", "");
						$(".modal .main .project3 .name").text("None");
					}
				});
				$(".modal " + modalSelector).css({"left": centerX, "top": centerY, "display": "block"});
			} else if(cordova.isCordova()) {
				console.log("set left, height on .modal .main in cordova");
				$(".modal " + modalSelector).css({"left": 0, "top": 0, "display": "block"});
			}
			prevState = ".main";
			setSlider();
		}
		else {
			if(modalSelector == ".upload") {
				$(".modal " + modalSelector + " .ask").css({"display": "initial"});
				$(".modal " + modalSelector + " .update").css({"display": "none"});
			} else if(modalSelector == ".setting") {
				$(".modal .setting .select .list").css({
					"height": 0,
					"border": 0
				});
			}

			if(modalSelector == ".openproject") {
				if(electron.isElectron()){
					file.getProjectList(function(lists){
						resetOpenprojectItem();
						lists.forEach(function(item){
							// addOpenprojectItem(electron.getThumbnail(item), item);
							electron.getThumbnail(item, function(data) {
								addOpenprojectItem(data, item);
							});
						});
					});
				} else{
					$(".modal " + modalSelector).css({"left": 0, "top": 0, "display": "block"});
				}
			}
			
			if(modalSelector == ".upload") {
				modal = $(".modal >" + modalSelector);
			}else {
				modal = $(".modal >" + modalSelector).clone().appendTo(".modal");
			}

			$(modal).css({"left": centerX, "top": centerY, "display": "block"});
			$(modal).draggable({
				handle: ".title",
				cancel: ".goback, .exit",
				stop: function(event, ui) {
					$(".modal > div").css({"transition": "top 0.5s, left 0.5s"});
					if(ui.offset.top < 0) {
						$(event.target).css({"top": $(".main .title .titleName").height()});
					}
					if(ui.offset.top + ui.helper[0].clientHeight > $(".main").height()) {
						$(event.target).css({"top": $(".main").height() - ui.helper[0].clientHeight});
					}
					if(ui.offset.left < 0) {
						$(event.target).css({"left": 0});
					}
					if(ui.offset.left + ui.helper[0].clientWidth > $(".main").width()) {
						$(event.target).css({"left": $(".main").width() - ui.helper[0].clientWidth});
					}
					window.setTimeout(function() {
						$(".modal > div").css({"transition": ""});
					}, 500);
				}
			});
		}
	}

	function setTitleName(name) {
		$(".title .titleName").text(name);
	}

	function appendUpdateText(string) {
		$text = $(".modal .upload .update .textDetail");
		$text.append(document.createTextNode(string));
		$text.append("<br>");
		$(".upload .textDetail").scrollTop($(".upload .textDetail")[0].scrollHeight);
	}

	function setSlider() {
		$(".modal .main .slider-pro").sliderPro({
			width: $(".modal .main .news").width(),
			height: $(".modal .main .news").height(),
			buttons: false,
			arrows: true
		});
	}

	function addNewprojectItem(name) {
		$(".modal > .newproject > .body > .file > ul").append("<li class='item'><div class='image'></div><div class='name "+name+"'>"+name+"</div></li>");
	}

	function deleteNewprojectItem(name) {
		$(".newproject"+" ."+name).parent().remove();
	}

	function resetNewprojectItem() {
		$(".modal > .newproject > .body > .file > ul > li").remove();
	}

	function addOpenprojectItem(image, name) {
		console.log("addOpenprojectItem");
		name = name.split(".")[0];
		if((image === undefined) || (image === "")) {
			image = "../image/recentproject/nothing.png";
		}

		$("<li class='item'><div class='delete'></div><img class='image' src='"+image+"'><div class='name "+name+"'>"+name+"</div></li>").appendTo($(".modal > .openproject > .body > .file > ul"));
	}

	function deleteOpenprojectItem(name) {
		$("."+name).parent().remove();
	}

	function resetOpenprojectItem() {
		$(".modal > .openproject > .body > .file > ul > li").remove();
	}

	function modalError(message) {
		$(".modal .error .body > .text").text(message);
	}
	
	function openasDraggable() {
		$(".modal .openproject").draggable({
			handle: ".title",
			cancel: ".goback, .exit",
			stop: function(event, ui) {
				$(".modal > div").css({"transition": "top 0.5s, left 0.5s"});
				if(ui.offset.top < 0) {
					$(event.target).css({"top": $(".main .title .titleName").height()});
				}
				if(ui.offset.top + ui.helper[0].clientHeight > $(".main").height()) {
					$(event.target).css({"top": $(".main").height() - ui.helper[0].clientHeight});
				}
				if(ui.offset.left < 0) {
					$(event.target).css({"left": 0});
				}
				if(ui.offset.left + ui.helper[0].clientWidth > $(".main").width()) {
					$(event.target).css({"left": $(".main").width() - ui.helper[0].clientWidth});
				}
				window.setTimeout(function() {
					$(".modal > div").css({"transition": ""});
				}, 500);
			}
		});
	}

	function toggleNetworkSettingHandler(event) {
		var thisSwitch = $(event.target).closest(".switch").find(".onoffSwitch");
		var notThisSwitch = $(event.target).closest(".wifi").find(".onoffSwitch").not(thisSwitch);

		var thisModeText = $(event.target).closest(".switch").parent().find("> .text");
		var notThisModeText = $(event.target).closest(".wifi").find("> div > .text").not(thisModeText);

		hName = "";
		pincode = "";
		password = "";

		if(!thisSwitch.is(":checked")) {
			notThisSwitch.removeAttr("checked");

			if(thisSwitch.hasClass("hotspotSwitch")) {
				notThisSwitch.parent().find(".label .handle").css({"top": "158px"});

				$(event.target).closest(".body").find(".list .item").removeClass("clicked");
				$(event.target).closest(".body").find(".list .item input").val("");
				$(event.target).closest(".body").find(".selected").text("");
			} else if(thisSwitch.hasClass("autoSwitch")) {
				thisSwitch.parent().find(".label .handle").css({"top": "68px"});

				nArrowFlag = false;
			}

			thisSwitch.parent().parent().find(".setting").css({"display":"initial"});
			notThisSwitch.parent().parent().find(".setting").css({"display":"none"});

			thisModeText.css({"color" : "rgb(38, 202, 211)"});
			notThisModeText.css({"color" : "rgb(0, 0, 0)"});
		} else {
			if(thisSwitch.hasClass("hotspotSwitch")) {
				notThisSwitch.parent().find(".label .handle").css({"top": "68px"});
			} else if(thisSwitch.hasClass("autoSwitch")) {
				thisSwitch.parent().find(".label .handle").css({"top": "68px"});

				$(event.target).closest(".body").find(".list .item input").val("");
				$(event.target).closest(".body").find(".selected").text("");
			}
			
			thisSwitch.parent().parent().find(".setting").css({"display":"none"});
			notThisSwitch.parent().parent().find(".setting").css({"display":"none"});

			thisModeText.css({"color" : "rgb(0, 0, 0)"});
			notThisModeText.css({"color" : "rgb(0, 0, 0)"});

			nArrowFlag = false;
		}

		$(".networkSetting .select .list").css({
			"height": 0,
			"border": 0
		});

		event.stopPropagation();
	}

	function closeNetworksettingHandler(event) {
		console.log("(modal.js) close network setting");
		
		$(event.target).closest(".networkSetting").css({"display": "none"});

		event.stopPropagation();
	}

	function networksettingOkHandler(event) {
		console.log("(modal.js) network setting ok button");
		var bluetoothName = $(event.target).closest(".body").find(".bluetooth .setting .name");
		var bluetoothPincode = $(event.target).closest(".body").find(".bluetooth .setting .pincode");

		var hotspotState = $(event.target).closest(".body").find(".hotspot > .switch > input");
		var autoState = $(event.target).closest(".body").find(".auto > .switch > input");

		var wifiMode;		// hotspot mode? auto mode?

		if(bluetoothName.val() !== "" && bluetoothPincode.val() !== "") {			// bluetooth name, pincode val 비어있지 않을 때
			bName = bluetoothName.val();
			bPincode = bluetoothPincode.val();
		} else {		// bluetooth name or pincode 비어 있을 때
			bName = "";
			bPincode = "";
		}

		if(hotspotState.is(":checked")) {
			hName = $(".hotspot > .setting > input.name").val();
			pincode = $(".hotspot > .setting > input.pincode").val();
			password = "";
		} else if(autoState.is(":checked")) {
			hName = "";
		} else {
			hName = "";
			pincode = "";
			password = "";
		}

		console.log("bName : bPincode = "+bName+" : "+bPincode);
		console.log("hName : pincode : password = "+hName+" : "+pincode+" : "+password);
	}

	function networksettingArrowClickHandler(event) {
		console.log("(modal.js)network setting arrow click handler");

		var key;
		var height;

		height = (nLength * 30) + 2;

		if(height > 302) {
			height = 302;
		}

		if(nArrowFlag) {
			$(".networkSetting .select .list").css({
				"height": 0,
				"border": 0
			});
		} else {
			$(".networkSetting .select .list").css({
				"height": height,
				"border": "1px solid #e6e6e6"
			});
		}

		nArrowFlag = !nArrowFlag;
		event.stopPropagation();
	}

	function networksettingItemClickHandler(event) {
		console.log("(modal.js)network setting item click handler");

		var list = $(event.target).closest(".list");
		var thisItem = $(event.target).closest(".item");

		if(thisItem.attr("class") !== list.find(".item.clicked").attr("class")) {
			list.find(".item").removeClass("clicked");
			thisItem.addClass("clicked");
		} else {
			list.find(".item").removeClass("clicked");

		}

		event.stopPropagation();
	}

	function addAutomodeItem(pinCode) {
		console.log("(modal.js) add item in auto mode");

		nLength += 1;

		$(".networkSetting .select .list").append('<div class="item"> <div class="image"> </div> <div class="text">'+ pinCode +'</div> <div class="setup"> <input type="text" class="password" placeholder="Password" data-langPlaceholder="5"> <div class="connect"> Connect </div> </div> </div>');
	}

	var hName = "";
	var pincode = "";
	var password = "";

	var bName = "";
	var bPincode = "";

	function clickAutomodeConnect(event) {
		console.log("(modal.js) click connect button in auto mode");
		pincode = $(event.target).closest(".item").find(".text").text();
		password = $(event.target).parent().find("input").val();

		if($(event.target).parent().find("input").val() === "" || $(event.target).parent().find("input").val() === undefined) {
			return;
		}

		$(event.target).closest(".select").find(".selected").text(pincode);

		$(".networkSetting .select .list").css({
			"height": 0,
			"border": 0
		});

		nArrowFlag = !nArrowFlag;

		event.stopPropagation();
	}

	function keyupAutomodePassword(event) {
		if($(event.target).val() === "" || $(event.target).val() === undefined) {
			$(event.target).parent().find(".connect").css({
				"color": "rgb(188, 188, 188)",
				"border": "1px solid rgb(188, 188, 188)"
			});
		} else {
			$(event.target).parent().find(".connect").css({
				"color": "rgb(38, 202, 211)",
				"border": "1px solid rgb(38, 202, 211)"
			});
		}
	}

	function settingArrowClickHandler(event) {
		console.log("(modal.js)arrow click handler");

		var key;
		var height;
		var length = 2;

		height = length * 30;

		if(arrowFlag) {
			$(".modal .setting .select .list").css({
				"height": 0,
				"border": 0
			});
		} else {
			$(".modal .setting .select .list").css({
				"height": height,
				"border": "1px solid #e6e6e6"
			});
		}

		arrowFlag = !arrowFlag;
		event.stopPropagation();
	}

	function settingItemClickHandler(event) {
		console.log("(modal.js)item click handler");

		$(event.target).closest(".setting").find(".selected").text($(event.target).text());
		$(event.target).closest(".setting").find(".table .title .data").text($(event.target).text());

		$(".modal .setting .select .list").css({
			"height": 0,
			"border": 0
		});
		arrowFlag = false;

		$(".modal .setting .selected").attr("data-lang", $(event.target).data("lang"));


		event.stopPropagation();
	}

	function settingOkHandler(event) {
		console.log("(modal.js) setting ok button");

		$(".modal .setting .selected").attr("data-save-lang", $(".modal .setting .selected").attr("data-lang"));

		var multiLanguage = require('multiLanguage');
		var lang = $(".modal .setting .selected").attr("data-save-lang");

		multiLanguage.setLanguage(lang); 

		closeModal();
	}

	function saveasKeyupHandler(event) {
		console.log("(modal.js) save as key up handler");

		var inputValue = $($(".modal .saveproject input")[1]).val();

		if(!electron.isProjectExist(inputValue)) {
			$(".modal .saveproject .body .existText").css({"display" : "none"});
			
			buttonActivation(".saveproject", ".save");
		} else if(electron.isProjectExist(inputValue)) {
			$(".modal .saveproject .body .existText").css({"display" : "block"});

			buttonInactivation(".saveproject",".save");
		}

	}

	function saveasClickHandler(event) {
		console.log("(modal.js) save as click handler");

		var inputValue = $($(".modal .saveproject input")[1]).val();

		var arrPickedColor = [
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)",
			"rgb(255, 255, 255)"
		];

		if(!electron.isProjectExist(inputValue)) {

			var file = require('file');
			var map = require('map');
			var daemon = require('daemon');
			// var connect_ = daemon.getConnect();

			var name = $($(".modal .saveproject .body input")[1]).val();
			var networkuuid = "TEST Network Module";
			// var port = connect_[networkuuid].port;

			createProject(name, networkuuid, function(){
				var guiblock = require('guiblock');
				guiblock.setArrPickedColor(arrPickedColor);

				file.saveProject(name, project.save(), function(bSuccess){


					closeModal();
					project.close();

					console.log("save result: "+bSuccess);
					if (bSuccess){
						var cui = require('cui');
						file.openProject(name, function(data){
							project.close();
							project.open(data);
							map.toggleLiveModuleMap(true);
							var uuids = project.getNetworkModuleUUIDs();
							requirejs(['daemon'], function(daemon){	
								// uuids.forEach(function(uuid){
								// 	daemon.reconnectAllModules(uuid);
								// });
								daemon.reconnectAllModules();
								closeModal();
								var menubox = require('menubox');
								// menubox.startPeriodicalSave();
							});
							file.saveRecentFile(name, function(bSuccess) {
								console.log("recent file save result: "+bSuccess);
							});
						});

						cui.createAceAction();
					}			

				});

			});

			// var init = require('init');
			// init.setDiv(65);

			if(event) {
				event.stopPropagation();
			}




		} else if(electron.isProjectExist(inputValue)) {
			return;




		}
	}

	$(document).ready(function() {
		addAutomodeItem("a");
		addAutomodeItem("b");
		addAutomodeItem("c");
		addAutomodeItem("d");
		addAutomodeItem("e");
		addAutomodeItem("f");
		addAutomodeItem("g");
		addAutomodeItem("h");
		addAutomodeItem("i");
		addAutomodeItem("g");
		addAutomodeItem("h");
		addAutomodeItem("i");

		setModalPosition(".modulereset");

		openasDraggable();

		$(document).on("keyup", keypressHandler);
		$(".modal").on("click", ".main .recent", recentProjectHandler);
		$(".modal").on("keypress", ".newproject .inputText", enterHandler);
		$(".modal").on("click", ".newproject .item", newProjectItemHandler);
		$(".modal").on("click", ".openproject .item", openProjectItemHandler);
		$(".modal").on("click", ".openproject .item .delete", deleteProjectItemHandler);
		$(".modal").on("dblclick", ".openproject .item", openProjectHandler);
		$(".modal").on("click touchstart touchend", ".main .getting", gettingStartHandler);
		$(".modal").on("click touchstart touchend", ".main .new", newProjectHandler);
		$(".modal").on("click touchstart touchend", ".main .openas", openAsHandler);
		$(".modal").on("click touchstart touchend", "> div .exit", closeModalHandler);
		$(".modal").on("click touchstart touchend", "> div .goback", goBackHandler);
		$(".modal").on("click touchstart touchend", "> .upload .close", closeModalHandler);
		$(".modal").on("click touchstart touchend", ".newproject .button", createProjectHandler);
		$(".modal").on("click touchstart touchend", ".openproject .button", openProjectHandler);
		$(".modal").on("click touchstart touchend", "> .modulereset .cancel", closeModalHandler);


		$(".main").on("click", ".networkSetting .switch label", toggleNetworkSettingHandler);
		$(".main").on("click", ".networkSetting .cancel", closeNetworksettingHandler);
		$(".main").on("click", ".networkSetting .ok", networksettingOkHandler);
		$(".main").on("click", ".networkSetting .arrow", networksettingArrowClickHandler);
		$(".main").on("click", ".networkSetting .selected", networksettingArrowClickHandler);
		$(".main").on("click", ".networkSetting .select .list .item div:not(.setup)", networksettingItemClickHandler);
		$(".main").on("click", ".networkSetting .select .list .item .connect", clickAutomodeConnect);
		$(".main").on("click", ".networkSetting .select .list .item input", keyupAutomodePassword);

		$(".modal").on("click", ".setting .selected", settingArrowClickHandler);
		$(".modal").on("click", ".setting .arrow", settingArrowClickHandler);
		$(".modal").on("click", ".setting .item", settingItemClickHandler);
		$(".modal").on("click", ".setting .ok", settingOkHandler);
		$(".modal").on("click", ".setting .cancel", closeModalHandler);

		$(".modal").on("click", ".saveproject .cancel", closeModalHandler);
		$(".modal").on("keyup", ".saveproject input", saveasKeyupHandler);
		$(".modal").on("click", ".saveproject .save", saveasClickHandler);


		if(electron.isElectron()) {
			console.log("(modal.js) set modal main div width in PC");
			for(var i = 1; i < 7; i++){
				$(".modal > .main > div:eq("+i+")").css({"width": $(".modal > .main").width()/6});
				$(".modal > .main > div:eq("+i+")").css({"left": ($(".modal > .main").width()/6)*(i-1)});
			}
			// $(".upload .buttonDetail").text("");
		} else if(cordova.isCordova()){
			$(".modal").on("touchstart touchend", "> div .titleExit", closeModalHandler);
			$(".main").on("click", ".backMobile", beforeOpenprojectHandler);
			$(".modal").on("touchstart touchend", "> div .open", openAsHandler);

			modalM.closeBeforeopenproject();
			modalM.setModalCenterMobile(".upload");
			modalM.setModalCenterMobile(".beforeOpenproject");
		}

		(function uploadModal() {
			$(".modal").on("click touchend", ".upload > .body > .ask > .ok", uploadAskOkClickHandler);
			$(".modal").on("click touchend", ".upload > .body > .ask > .cancel", uploadAskCancelClickHandler);
			$(".modal").on("click touchend", ".upload > .body > .update > .buttonDetail", uploadDetailButtonClickHandler);
			$(".modal").on("click touchend", ".upload .close", uploadCloseClickHandler);
		}());

		(function modalCheckupdate() {
			$(document).on("click",".modal > .checkupdate > .body > .checked > .update", checkVersionClickHandler);
		}());

		(function setVerticalSlider() {
			$(".slider").slider({
				orientation: "vertical",
				range: "min",
				min: 0,
				max: 100,
				value: 60
			});
		}());

		(function newprojectButtonColor() {
			$(".modal").on("keyup", ".newproject > .body > .inputText", newprojectKeyupHandler);
			$(".modal").on("click", ".newproject .item", newprojectItemClickHandler);
		}());

		$(".modal").on("click", ".modulereset .ok", moduleresetOkButtonHandler);
	});

	function uploadAskOkClickHandler(event) {
		var uploadDiv = $(this).parents(".upload");
		if(electron.isElectron()) {
			var modalUploadToggle = 0;

			uploadDiv.css({"height": 560});
			uploadDiv.find(".body").css({"height": 520});
		} else if(cordova.isCordova()){
			$(this).toggleClass("clickOk");
			uploadDiv.css({"height": 399});
			uploadDiv.find(".body").css({"height": 361});
		}
		uploadDiv.find(".ask").css({"display": "none"});
		uploadDiv.find(".update").css({"display": "initial"});
		// todo make center function
		var centerX = ($("body").width() - $(".modal > .upload").width()) / 2;
		var centerY = ($("body").height() - $(".modal > .upload").height()) / 2;
		$(".modal > .upload").css({"left": centerX, "top": centerY});
		$(".upload > .body > .update > .buttonDetail").addClass("show"); // update창에 button클래스를 항상 보이는 상태로 유지하는 예외 

		requirejs(['title', 'builder'], function(title, builder){
			luxc = title.gui2Code();
			builder.setUpdateMode(1);
			builder.begin( luxc );
		});
	}

	function uploadAskCancelClickHandler(event) {
		if(cordova.isCordova()){
			$(this).toggleClass("clickCancel");
		}
		
		closeModal();
		requirejs(['title'], function(title){
			title.enableUpload(true);
		});
		if(cordova.isCordova()){
			event.preventDefault();
		}
	}

	function uploadDetailButtonClickHandler(event) {
		if(electron.isElectron()) {
			console.log("(init.js) toggle buttonDetail in pc");

			$(this).toggleClass("show");

			var uploadDiv = $(this).parents(".upload");

			if(uploadDiv.hasClass("toggleUpload")) {
				// $(this).find(".text").text("Hide Details");
				$(this).css({"display": "none"});
				$(this).parent().find(".showDetail").css({"display": "none"});
				$(this).parent().find(".hideDetail").css({"display": "initial"});
				uploadDiv.animate({
					height: 560
				}, 450);
				uploadDiv.find(".body").animate({
					height: 520
				}, 450);
				uploadDiv.find(".update").animate({
					height: 520
				}, 450);
				uploadDiv.find(".textDetail").animate({
					height: 170,
					paddingTop: 10
				}, 450);
				uploadDiv.removeClass("toggleUpload");
			} else {
				// $(this).find(".text").text("Show Details");
				$(this).css({"display": "none"});
				$(this).parent().find(".hideDetail").css({"display": "none"});
				$(this).parent().find(".showDetail").css({"display": "initial"});
				uploadDiv.animate({
					height: 360
				}, 450);
				uploadDiv.find(".body").animate({
					height: 320
				}, 450);
				uploadDiv.find(".update").animate({
					height: 320
				}, 450);
				uploadDiv.find(".textDetail").animate({
					height: 0,
					paddingTop: 0
				}, 450);
				uploadDiv.addClass("toggleUpload");
			}
		} else if(cordova.isCordova()){
			$(this).toggleClass("clickButtonDetail");

			modalM.toggleButtonDetail();
			event.preventDefault();
		}
		// $(".modal > .upload > .body").css({"height": 520});
		// $(".modal > .upload > .body > .update").css({"height": 520});
	}

	function uploadCloseClickHandler(event) {
		closeUpload();
		if(cordova.isCordova()){
			event.preventDefault();
		}
	}

	function checkVersionClickHandler(event) {
		$(".modal > .checkupdate > .body > .checked > .update").css({"display": "none"});
		$(".modal > .checkupdate > .body > .checked > meter").css({"display": "initial"});
	}

	function newprojectKeyupHandler(event) {
		console.log("(modal.js)is project exist? and change text in newproject");

		var inputValue = $(".modal .newproject > .body .inputText")[1].value;
		if(!electron.isProjectExist(inputValue)) {
			$(".modal .newproject .body .existText").css({"display" : "none"});
			if($(".modal .newproject .item").hasClass("click")) {
				if(electron.isElectron()){//pc
					buttonActivation(".newproject", ".button");
				} else if(cordova.isCordova()){//mobile
					if( inputValue === "" || inputValue === undefined) { //값이 없을 때
						buttonInactivation(".newproject", ".button");
					}
					else if($(".modal .newproject .item").hasClass("click")){ //값이 있는데 item도 click되어있을 때
						buttonActivation(".newproject", ".button");
					}
				}
			}
		} else if(electron.isProjectExist(inputValue)) {
			$(".modal .newproject .body .existText").css({"display" : "block"});
			if( inputValue === "" || inputValue === undefined) {
				$(".modal .newproject .body .existText").css({"display" : "none"});
			}

			buttonInactivation(".newproject", ".button");
		}
	}

	function newprojectItemClickHandler(event) {
		var inputValue = $(this).parents(".newproject").find(".inputText").val();
		if(cordova.isCordova()){//mobile
			if($(".modal .newproject .item").hasClass("click")){
				$(".modal > .newproject > .body > .text").css("bottom", "-68px");
			}
			else{
				$(".modal > .newproject > .body > .text").css("bottom", $(".modal > .newproject > .body > .buttonBackground").outerHeight(true));
			}
		}
		if(!electron.isProjectExist(inputValue) && inputValue !== "" && inputValue !== undefined && $(".modal .newproject .item").hasClass("click")) {
			buttonActivation(".newproject", ".button");
		}
		else {
			buttonInactivation(".newproject", ".button");
		}
	}

	function moduleresetOkButtonHandler(event) {
		closeModal();
		openModal(".upload");

		var uploadDiv = $(".modal .upload");
		if(electron.isElectron()) {
			var modalUploadToggle = 0;

			uploadDiv.css({"height": 560});
			uploadDiv.find(".body").css({"height": 520});
		} else if(cordova.isCordova()) {
			uploadDiv.css({"height": 416});
			uploadDiv.find(".body").css({"height": 378});
		}
		uploadDiv.find(".ask").css({"display": "none"});
		uploadDiv.find(".update").css({"display": "initial"});
		// todo make center function
		var centerX = ($("body").width() - $(".modal > .upload").width()) / 2;
		var centerY = ($("body").height() - $(".modal > .upload.ui-draggable").height()) / 2;
		$(".modal > .upload").css({"left": centerX, "top": centerY});
		$(".upload > .body > .update > .buttonDetail").addClass("show"); // update창에 button클래스를 항상 보이는 상태로 유지하는 예외 

		requirejs(['builder', 'title'], function(builder, title){
			builder.setUpdateMode(2);
			var luxc = title.genResetCode();
			builder.begin(luxc);
		});
	}

	function buttonActivation(modal, button) {
		$(".modal " + modal + " .body "+button).css({
			"color": "rgb(38, 202, 211)",
			"border": "1px solid rgb(38, 202, 211)",
				"background": "rgb(255, 255, 255)"
		});		
		$(".modal " + modal + " .body "+button).hover(function() {
			$(this).css({
				"color": "rgb(255, 255, 255)",
				"background": "rgb(38, 202, 211)"
			});
		}, function() {
			$(this).css({
				"color": "rgb(38, 202, 211)",
				"background": "rgb(255, 255, 255)"
			});
		});
	}

	function buttonInactivation(modal, button) {
		$(".modal " + modal + " .body "+button).css({
			"color": "rgb(209, 209, 209)",
			"border": "1px solid rgb(209, 209, 209)"
		});	
		$(".modal " + modal + " .body "+button).hover(function() {
			$(this).css({
				"color": "rgb(209, 209, 209)",
				"background": "rgb(255, 255, 255)"
			});
		}, function() {
			$(this).css({
				"color": "rgb(209, 209, 209)",
				"background": "rgb(255, 255, 255)"
			});
		});
	}

	function closeUpload() {
		clearUpdateText();
		showUploadDuringUpdate();
		$(".modal .upload").css({"height": "240px"});
		$(".modal .upload .body").css({"height": "200px"});

		function clearUpdateText() {
			$(".modal .upload .update .textDetail").text("");
		}

		function showUploadDuringUpdate() {
			if (electron.isElectron()) {
				$(".modal > .upload").css({"height": 560});
				$(".modal > .upload > .body").css({"height": 520});
				$(".modal > .upload .update > .gif").css({"display": "initial"});

				$(".modal > .upload .update > .textUpdate").css({"display" : "none"});
				$(".modal > .upload .update > .textUpdate.base").css({"display" : "initial"});

				$(".modal > .upload .update > .icon").css({
					"top": "190px",
					"display": "initial",
					"background": "url('image/modal/warning.svg') no-repeat"
				});

				$(".modal > .upload .update > .textWarning").css({"display" : "none"});
				$(".modal > .upload .update > .textWarning.base").css({"display" : "initial"});

				$(".modal > .upload .update > .textWarning").css({"top": "187px"});
				$(".modal > .upload .update > .textDetail").css({"top": "260px"});

				$(".modal > .upload .update > .buttonDetail").css({"display": "none"});
				$(".modal > .upload .update > .buttonDetail.hideDetail").css({"display": "initial"});
				$(".modal > .upload .update > .close").css({"display": "none"});

				var centerX = ($("body").width() - $(".modal > .upload").width()) / 2;
				var centerY = ($("body").height() - $(".modal > .upload.ui-draggable").height()) / 2;
				$(".modal > .upload").css({"left": centerX, "top": centerY});
				// $(".upload > .body > .update > .buttonDetail").addClass('show'); // update창에 button클래스를 항상 보이는 상태로 유지하는 예외 
			} else if(cordova.isCordova()) {
				modalM.showUploadDuringUpdateMobile();
			}
		}
	}

	function setLandingCenter() {
		var centerX = ($("body").width() - $(".modal > .main").width()) / 2;
		var centerY = ($("body").height() - $(".modal > .main").height()) / 2;
		$(".modal > .main").css({"left": centerX, "top": centerY});
	}

	$(window).resize(function() {
		if($(".modal > .main").css("display") != "none") {
			setLandingCenter();
		}

		if(cordova.isCordova()) {
			modalM.setModalCenterMobile(".upload");
		}
	});

	function showUploadUpdateResult(icon, Color, textResult) {
		console.log("(modal.js) show Upload Update Result in pc");
		$(".modal > .upload").css({"height": "430px"});
		$(".modal > .upload > .body").css({"height": "390px"});

		$(".modal > .upload .update > .gif").css({"display": "none"});

		$(".modal > .upload .update > .textUpdate").css({"display" : "none"});
		$(".modal > .upload .update > .textUpdate."+textResult).css({
			"display" : "initial"
		});

		$(".modal > .upload .update > .icon").css({
			"top": "60px",
			"background": "url('image/modal/"+icon+".svg') no-repeat"
		});

		$(".modal > .upload .update > .textWarning").css({"display" : "none"});
		$(".modal > .upload .update > .textWarning."+textResult).css({"display" : "initial"});

		$(".modal > .upload .update > .textWarning").css({"top": "60px"});
		$(".modal > .upload .update > .textDetail").css({"top": "130px"});

		$(".modal > .upload .update > .buttonDetail").css({"display": "none"});
		$(".modal > .upload .update > .close").css({"display": "initial"});
	}

	function showUploadUpdateFailed() {
		if (electron.isElectron()) {
			showUploadUpdateResult("error", "rgb(241, 90, 41)", "updateFailed");
		} else if(cordova.isCordova()) {
			modalM.showUploadUpdateResultMobile("error", "rgb(239, 65, 54)", "Update failed", "An error occurred. Please see the event log below.");
		}
	}

	function showUploadUpdateSuccess() {
		if(electron.isElectron()) {
			showUploadUpdateResult("caution", "rgb(0, 0, 0)", "updateSuccess");
		} else if(cordova.isCordova()) {
			modalM.showUploadUpdateResultMobile("check", "rgb(0, 0, 0)", "Update success", "The software update is complete.");
		}
	}

	return {
		openModal: openModal,
		showUploadUpdateFailed: showUploadUpdateFailed,
		showUploadUpdateSuccess: showUploadUpdateSuccess,
		addNewprojectItem: addNewprojectItem,
		deleteNewprojectItem: deleteNewprojectItem,
		resetNewprojectItem: resetNewprojectItem,
		addOpenprojectItem: addOpenprojectItem,
		deleteOpenprojectItem: deleteOpenprojectItem,
		resetOpenprojectItem: resetOpenprojectItem,
		modalError: modalError,
		resettingNewProjectList: resettingNewProjectList,
		setSieveOpenproject: setSieveOpenproject,
		update: {
			appendText: appendUpdateText
		},
		settingOkHandler: settingOkHandler
	};
});