define(["jquery", "console", "base", "plumb"], function($, console, base, plumb) {
	console.log("MAPMODULE INIT");

	var moduleCount = {
		number: 0,
		random: 0,
		mic: 0,
		dial: 0,
		environment: 0,
		gyro: 0,
		button: 0,
		ir: 0,
		ultrasonic: 0,
		motor: 0,
		led: 0,
		display: 0,
		speaker: 0,
		usb: 0,
		network: 0
	};

	var helpTable = {
		mic: '<div class="body wholeModuleMic"> <div class="text" data-langNum="237"> Set a condition by using Mic module. </div> </div></div>',
		dial: '<div class="body wholeModuleDial"> <div class="text" data-langNum="238"> Set a condition by using Dial module. </div> </div></div>',
		environment: '<div class="body wholeModuleEnvironment"> <div class="text" data-langNum="240"> Set a condition by using Environment module. </div> </div></div>',
		gyro: '<div class="body wholeModuleGyroscope"> <div class="text" data-langNum="241"> Set a condition by using Gyroscope module. </div> </div></div>',
		button: '<div class="body wholeModuleButton"> <div class="text" data-langNum="236"> Set a condition by using Button module. </div> </div></div>',
		ir: '<div class="body wholeModuleInfrared"> <div class="text" data-langNum="239"> Set a condition by using Infrared module. </div> </div></div>',
		ultrasonic: '<div class="body wholeModuleUltrasonic"> <div class="text" data-langNum="242"> Set a condition by using Ultrasonic module. </div> </div></div>',
		motor: '<div class="body wholeModuleMotor"> <div class="text" data-langNum="243"> Set a condition by using Motor module. </div> </div></div>',
		led: '<div class="body wholeModuleLed"> <div class="text" data-langNum="244"> Set a condition by using Led module. </div> </div></div>',
		display: '<div class="body wholeModuleDisplay"> <div class="text" data-langNum="245"> Set a condition by using Display module. </div> </div></div>',
		speaker: '<div class="body wholeModuleSpeaker"> <div class="text" data-langNum="246"> Set a condition by using Speaker module. </div> </div></div>',
		network: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat center;"> <div class="text" data-langNum="248"> Set a condition by using Network module </div> </div></div>',

		random: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat center;"><div class="text" data-langNum="249"> randomrandomrandomrandomrandomrandom </div></div></div>',
		number: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat center;"><div class="text" data-langNum="247"> numbernumbernumbernumbernumbernumber </div></div></div>'
	};

	function Mapmodule() {
		this.module = $('<li class="module"><div class="image"></div><div class="text"></div><div class="exit"></div></li>');
	}
	Mapmodule.prototype = new base.Base();

	/**
		append module to map

		* x : coordinate X
			- data type : number
		* y : coordinate Y
			- data type : number
		* object : UUID, NAME, TITLE, SUBTITLE, TYPE, SUBTYPE, FROM, STATUS, MOVED
			- data type : object
	*/
	Mapmodule.prototype.appendModule = function(x, y, object) {
		var main = require('main');
		var guiblock = require('guiblock');

		var el = this.module;
		var thisObject = this;
		var help = "";

		var h = $(".map .mapBody").html();
		var w = JSON.parse(JSON.stringify(guiblock.getArrWhat()));
		var d;
		var c = JSON.parse(JSON.stringify(moduleCount));

		if(isModuleExist(object.uuid) && object.uuid!==0) {
			
		} else {
			el.css({"left": x+"px", "top": y+"px", "position": "absolute"});
			this.initModule(el, object);
			$(".modulemap").append(el);

			if(thisObject.type !== "display") {
				if(thisObject.type === "random") {
					d = JSON.parse(JSON.stringify(guiblock.getArrRandom()));
					main.pushUndo(1, "map", h, w, "random", d, c);
					guiblock.pushArrRandom({
						imagePath: "image/icon20/var.svg",
						type: "var",
						name: thisObject.name,
						helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat center;"><div class="text">	</div></div></div>',
					});
				} else if(thisObject.type === "number") {
					d = JSON.parse(JSON.stringify(guiblock.getArrNumber()));
					main.pushUndo(1, "map", h, w, "number", d, c);
					guiblock.pushArrNumber({
						imagePath: "image/icon20/var.svg",
						type: "var",
						name: thisObject.name,
						helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat center;"><div class="text">	</div></div></div>',
					});
				} else {
					if(thisObject.subtitle === "input") {
						d = JSON.parse(JSON.stringify(guiblock.getArrInput()));
						main.pushUndo(1, "map", h, w, "input", d, c);
						guiblock.pushArrInput({
							imagePath: "image/icon20/" + thisObject.type +".svg",
							name: thisObject.name,
							type: thisObject.type,
							isModule: true,
							helpMessage: helpTable[thisObject.type]
						});
					} else if(thisObject.subtitle === "output") {
						d = JSON.parse(JSON.stringify(guiblock.getArrOutput()));
						main.pushUndo(1, "map", h, w, "output", d, c);
						guiblock.pushArrOutput({
							imagePath: "image/icon20/" + thisObject.type +".svg",
							name: thisObject.name,
							type: thisObject.type,
							isModule: true,
							helpMessage: helpTable[thisObject.type]
						});
					} else {
						d = JSON.parse(JSON.stringify(guiblock.getArrNetwork()));
						main.pushUndo(1, "map", h, w, "network", d, c);
						guiblock.pushArrNetwork({
							imagePath: "image/icon20/" + thisObject.type +".svg",
							name: thisObject.name,
							type: thisObject.type,
							isModule: true,
							helpMessage: helpTable[thisObject.type]
						});
					}
				}

				// thisObject.TYPE=="random" ? guiblock.pushArrRandom({
				// 	imagePath: "image/icon20/var.svg",
				// 	type: "var",
				// 	name: thisObject.NAME,
				// 	helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat center;"><div class="text">	</div></div></div>',
				// }) : thisObject.TYPE=="number" ? guiblock.pushArrNumber({
				// 	imagePath: "image/icon20/var.svg",
				// 	type: "var",
				// 	name: thisObject.NAME,
				// 	helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat center;"><div class="text">	</div></div></div>',
				// }) : thisObject.SUBTITLE=="input" ? guiblock.pushArrInput({
				// 	imagePath: "image/icon20/" + thisObject.TYPE +".svg",
				// 	name: thisObject.NAME,
				// 	type: thisObject.TYPE,
				// 	isModule: true,
				// 	helpMessage: helpTable[thisObject.TYPE]
				// }) : thisObject.SUBTITLE=="output" ? guiblock.pushArrOutput({
				// 	imagePath: "image/icon20/" + thisObject.TYPE +".svg",
				// 	name: thisObject.NAME,
				// 	type: thisObject.TYPE,
				// 	isModule: true,
				// 	helpMessage: helpTable[thisObject.TYPE]
				// }) : guiblock.pushArrNetwork({
				// 	imagePath: "image/icon20/" + thisObject.TYPE +".svg",
				// 	name: thisObject.NAME,
				// 	type: thisObject.TYPE,
				// 	isModule: true,
				// 	helpMessage: helpTable[thisObject.TYPE]
				// });
			}
			
			$(el).find(".image").attr("id", this.getName()+"Image");
		}
	};

	/**
		remove module from map
	*/
	Mapmodule.prototype.removeModule = function() {

	};

	/**
		initializing module

		* module : module that want to be initialized
			- data type : element
		* object : UUID, NAME, TITLE, SUBTITLE, TYPE, SUBTYPE, FROM, STATUS, MOVED
			- data type : object
	*/
	Mapmodule.prototype.initModule = function(module, object) {
		var el = module;

		if(object !== undefined) {
			$(el).attr("data-uuid", object.uuid);
			$(el).attr("data-id", object.id);
			$(el).attr("data-name", object.name+moduleCount[object.name]);
			$(el).attr("data-title", object.title);
			$(el).attr("data-subtitle", object.subtitle);
			$(el).attr("data-type", object.type);
			$(el).attr("data-subtype", object.subtype);
			$(el).attr("data-from", object.from);
			$(el).attr("data-os", object.os);
			$(el).attr("data-status", object.status);
			$(el).attr("data-moved", object.moved);

			this.setConfiguration(object);
		}

		plumb.mapInstance.batch(function() {
			plumb.initPlumbMapmodule(plumb.mapInstance, module);
		});
	};

	/**
		setting configure of module
	*/
	Mapmodule.prototype.setConfiguration = function(object) {
		var el = this.module;
		var itr;

		if(object !== undefined) {
			object.name += moduleCount[object.type]++;
			for(itr = 0; itr < Object.keys(object).length; itr++) {
				$(el).data(Object.keys(object)[itr], object[Object.keys(object)[itr]]);
			}

			this.setUuid(object.uuid);
			this.setId(object.id);
			this.setName(object.name);
			this.setTitle(object.title);
			this.setSubtitle(object.subtitle);
			this.setType(object.type);
			this.setSubtype(object.subtype);
			this.setFrom(object.from);
			this.setOs(object.os);
			this.setStatus(object.status);
			this.setMoved(object.moved);
		}

		$(el).attr({"id": this.getName()});
		$(el).addClass(this.type);
		$(el).addClass(this.subtitle);
		$(el).addClass("dd-item");
		$(el).find(".image").addClass("dd-handle").attr("id", this.getName()+"Image");
		$(el).find(".text").text(this.name);
	};

	function getModuleCount() {
		return moduleCount;
	}

	function setModuleCount(obj) {
		moduleCount = obj;
	}

	function initModuleCount() {
		for (var key in moduleCount) {
			moduleCount[key] = 0;
		}
	}

	function isModuleExist(uuid) {
		var modules = $(".map .module");
		var ret = false;

		modules.each(function(itr) {
			if($(this).data("uuid") == uuid) {
				ret = true;
				return false;
			}
		});

		return ret;
	}

	function isNameExist(name) {
		var modules = $(".map .module");
		var ret = false;

		modules.each(function(itr) {
			if($(this).data("name") == name) {
				ret = true;
				return false;
			}
		});

		return ret;
	}

	function changeName(srcName, dstName) {
		var modules = $(".map .module");

		modules.each(function(itr) {
			if($(this).data("name") == srcName) {
				$(this).attr("data-name", dstName);
				$(this).data("name", dstName);
				$(this).find(".text").text(dstName);
				return false;
			}
		});
	}

	return {
		Mapmodule: Mapmodule,		// 객체를 생성하기 위함
		getModuleCount: getModuleCount,		// 현재 맵에 나와있는 모듈 개수를 얻기 위함(맵에 모듈을 추가할 때마다 모듈번호가 1씩 증가)
		setModuleCount: setModuleCount,
		connectMapmodules: plumb.connectMapmodules,		// 두 개의 모듈을 선으로 이어주기 위함
		mapInstance: plumb.mapInstance,		// 모듈을 선으로 이어주기 위한 맵 인스턴스
		initModuleCount: initModuleCount,
		isNameExist: isNameExist,			// 모듈 이름이 있는지 검사
		changeName: changeName		// 모듈 이름 변경
	};
});