define(["jquery", "console", "mapmodule", 'cordova', 'electron', 'mapM', 'queue'], function($, console, mapmodule, cordova, electron, mapM, queue) {
	console.log("MAP INIT");

	var direction = {
		"up": 'u',
		"down": 'd',
		"right": 'r',
		"left": 'l'
	};
	var bLiveModuleMap_ = false;

	function toggleLiveModuleMap(bool){
		bLiveModuleMap_ = bool;
	}

	function showModulemapHandler(event) {
		console.log("(map.js)show module map handler");
		if(electron.isElectron()) {
			console.log("(init.js)  with pc");
			$(".map .tabModulemap").css({"background-color": "#fff"});
			$(".map .tabLiverot").css({"background-color": "#d1d1d1"});
			$(".map .modulemap").css({"display": "block"});
			$(".map .liverot").css({"display": "none"});
		} else if(cordova.isCordova()) {
			mapM.showLiverotHandlerMobile();
		}
		event.stopPropagation();
	}

	function showLiverotHandler(event) {
		console.log("(map.js)show live rot handler");
		if(electron.isElectron()) {
			console.log("(init.js)  with pc");
			$(".map .tabModulemap").css({"background-color": "#d1d1d1"});
			$(".map .tabLiverot").css({"background-color": "#fff"});
			$(".map .modulemap").css({"display": "none"});
			$(".map .liverot").css({"display": "block"});
		} else if(cordova.isCordova()) {
			mapM.showModulemapHandlerMobile();
		}
		event.stopPropagation();
	}

	function deleteModuleHandler(event) {
		var main = require('main');
		var mapmodule = require('mapmodule');
		var guiblock = require('guiblock');
		var plumb = require('plumb');
		var module = $(event.target).closest(".module");
		var name = $(module).data("name");
		var h = $(".map .mapBody").html();
		var a;
		var w = JSON.parse(JSON.stringify(guiblock.getArrWhat()));
		var d;
		var c = JSON.parse(JSON.stringify(mapmodule.getModuleCount()));

		if(module.data("subtitle") === "input") {
			a = "input";
			d = JSON.parse(JSON.stringify(guiblock.getArrInput()));
			guiblock.removeArrInputData(name);
		} else if(module.data("subtitle") === "output") {
			a = "output";
			d = JSON.parse(JSON.stringify(guiblock.getArrOutput()));
			guiblock.removeArrOutputData(name);
		} else {
			if(module.data("type") === "network") {
				a = "network";
				d = JSON.parse(JSON.stringify(guiblock.getArrNetwork()));
				guiblock.removeArrNetworkData(name);
			} else if(module.data("type") === "number") {
				a = "number";
				d = JSON.parse(JSON.stringify(guiblock.getArrNumber()));
				guiblock.removeArrNumberData(name);
			} else if(module.data("type") === "random") {
				a = "random";
				d = JSON.parse(JSON.stringify(guiblock.getArrRandom()));
				guiblock.removeArrRandomData(name);
			}
		}

		main.pushUndo(1, "map", h, w, a, d, c);
		plumb.mapInstance.detachAllConnections($(event.target).closest(".module").attr("id"));
		$(event.target).closest(".module").remove();
	}

	/**
		place dstBase module next to srcBase module at dir side.
	*/
	function placeModule(dstBase) {
		var dstModule;
		var dstX;
		var dstY;

		if (!bLiveModuleMap_) return;

		var itr;
		for(itr = 0; itr < $(".main .map .module").length; itr++) {
			if($($(".main .map .module")[itr]).data("uuid") == dstBase.uuid) {
				return;
			}
		}
		dstModule = new mapmodule.Mapmodule();
		dstX = ($(".main .map").width() / 2);
		dstY = ($(".main .map").height() / 2);
		dstModule.appendModule(dstX, dstY, dstBase);
		changeStatus(dstModule.uuid, dstModule.status);
	}

	// for(var key in object) {
	//     object[key]
	// }

	function getTopologyData(uuid) {
		var topo = {};

		$(".map .module").each(function(itr) {
			if($(this).data("uuid") == uuid) {
				topo.u = $(this).data("u");
				topo.d = $(this).data("d");
				topo.r = $(this).data("r");
				topo.l = $(this).data("l");
				return false;
			}
		});

		return topo;
	}

	function setTopologyData(uuid, object) {
		$(".map .module").each(function(itr) {
			if($(this).data("uuid") == uuid) {
				$(this).data("u", object.u);
				$(this).data("d", object.d);
				$(this).data("r", object.r);
				$(this).data("l", object.l);
				return false;
			}
		});
	}

	function moveModule() {
		var plumb = require('plumb');

		var q = new queue.Queue();
		var object = {};
		var stack = [];
		var dstX;
		var dstY;
		var srcX;
		var srcY;

		object = {};

		$(".map .module").each(function(itr) {
			var key = $(this).data("uuid");
			object[key] = {
				u: $(this).data("u") === undefined ? 0xffff : $(this).data("u"),
				d: $(this).data("d") === undefined ? 0xffff : $(this).data("d"),
				r: $(this).data("r") === undefined ? 0xffff : $(this).data("r"),
				l: $(this).data("l") === undefined ? 0xffff : $(this).data("l"),
				dEnd: 0,
				type: $(this).data("subtitle")
			};
		});

		if(!Object.keys(object).length)	return;

		// setNetworkTopology();

		for(var key in object) {
			if(object[key].type == "network") {
				redirection(key, object[key]);
			}
			break;
		}

		for(var key in object) {
			if(key !== "0") {
				$(".map .module.con").each(function(itr) {
					if($(this).data("uuid") == key) {
						object[key].position = $(this).position();
						$(this).addClass("topologied");
						return false;
					}
				});
				move(object[key]);
				break;
			}
		}

		setModulesetCenter();
		sortUntopologiedModules();
		plumb.redrawAllConnections(plumb.mapInstance);

		function redirection(thisUUID) {
			var topology = object[thisUUID];
			var subTopology = {};
			object[thisUUID].dEnd = 1;

			if(topology.u !== 0xffff) {
				if(object[topology.u].dEnd === 0) {
					subTopology = object[topology.u];
					if(subTopology.u == thisUUID) {
						rotateRight90(subTopology, 2);
					}
					else if(subTopology.d == thisUUID) {

					}
					else if(subTopology.r == thisUUID) {
						rotateRight90(subTopology, 1);
					}
					else if(subTopology.l == thisUUID) {
						rotateRight90(subTopology, 3);
					}
					object[topology.u].dEnd = 1;
					q.enqueue(topology.u);
				}
			}
			if(topology.d !== 0xffff) {
				if(object[topology.d].dEnd === 0) {
					subTopology = object[topology.d];
					if(subTopology.u == thisUUID) {
						
					}
					else if(subTopology.d == thisUUID) {
						rotateRight90(subTopology, 2);
					}
					else if(subTopology.r == thisUUID) {
						rotateRight90(subTopology, 3);
					}
					else if(subTopology.l == thisUUID) {
						rotateRight90(subTopology, 1);
					}
					object[topology.d].dEnd = 1;
					q.enqueue(topology.d);
				}
			}
			if(topology.r !== 0xffff) {
				if(object[topology.r].dEnd === 0) {
					subTopology = object[topology.r];
					if(subTopology.u == thisUUID) {
						rotateRight90(subTopology, 3);
					}
					else if(subTopology.d == thisUUID) {
						rotateRight90(subTopology, 1);
					}
					else if(subTopology.r == thisUUID) {
						rotateRight90(subTopology, 2);
					}
					else if(subTopology.l == thisUUID) {
						
					}
					object[topology.r].dEnd = 1;
					q.enqueue(topology.r);
				}
			}
			if(topology.l !== 0xffff) {
				if(object[topology.l].dEnd === 0) {
					subTopology = object[topology.l];
					if(subTopology.u == thisUUID) {
						rotateRight90(subTopology, 1);
					}
					else if(subTopology.d == thisUUID) {
						rotateRight90(subTopology, 3);
					}
					else if(subTopology.r == thisUUID) {
						
					}
					else if(subTopology.l == thisUUID) {
						rotateRight90(subTopology, 2);
					}
					object[topology.l].dEnd = 1;
					q.enqueue(topology.l);
				}
			}

			if(!q.isEmpty()) {
				redirection(q.dequeue());
			}
		}

		// network module은 topology data가 없기때문에
		function setNetworkTopology() {
			var network = $(".map .module.network");
			if(!network.length)	return;
			var networkUUID = network.data("uuid");

			object[networkUUID].u = 0xffff;
			object[networkUUID].d = 0xffff;
			object[networkUUID].r = 0xffff;
			object[networkUUID].l = 0xffff;

			for(var uuid in object) {
				if(uuid == networkUUID)	continue;
				for(var dir in object[uuid]) {
					if(object[uuid][dir] == networkUUID) {
						if(dir == "u") {
							object[networkUUID].d = parseInt(uuid);
							network.data("d", uuid);
							break;
						}
						else if(dir == "d") {
							object[networkUUID].u = parseInt(uuid);
							network.data("u", uuid);
							break;
						}
						else if(dir == "r") {
							object[networkUUID].l = parseInt(uuid);
							network.data("l", uuid);
							break;
						}
						else if(dir == "l") {
							object[networkUUID].r = parseInt(uuid);
							network.data("r", uuid);
							break;
						}
					}
				}
			}
		}

		function move(data) {
			if(!data.position) {
				data.position = {left: 10, top: 10};
			}
			data.end = 1;
			srcX = data.position.left;
			srcY = data.position.top;

			for(var key in data) {
				if(["end", "position", "dEnd", "type"].includes(key)) {
					continue;
				}
				if(data[key] !== 0xffff && data[key] !== undefined) {
					if(object[data[key]].end !== 1){
						if(key === "u") {
							dstX = srcX;
							dstY = srcY - $(".main .map .module").height() - 20;
						}
						else if(key === "d") {
							dstX = srcX;
							dstY = srcY + $(".main .map .module").height() + 20;
						}
						else if(key === "l") {
							dstX = srcX - $(".main .map .module").width() - 20;
							dstY = srcY;
						}
						else if(key === "r") {
							dstX = srcX + $(".main .map .module").width() + 20;
							dstY = srcY;
						}

						$(".map .module").each(function(itr) {
							if($(this).data("uuid") == data[key]) {
								$(this).css({
									top: dstY,
									left: dstX
								});
								$(this).addClass("topologied");
								return false;
							}
						});

						object[data[key]].position = {
							top: dstY,
							left: dstX
						};
						object[data[key]].end = 1;
						stack.push(object[data[key]]);
					}
				}
			}
			if(stack.length) {
				move(stack.pop());
			}
		}

		function setModulesetCenter() {
			var minX = $($(".main .map .module.topologied")[0]).position().left;
			var maxX = $($(".main .map .module.topologied")[0]).position().left;
			var minY = $($(".main .map .module.topologied")[0]).position().top;
			var maxY = $($(".main .map .module.topologied")[0]).position().top;

			var midX;
			var midY;

			var dX;
			var dY;

			$(".main .map .module.topologied").each(function(itr) {
				(minX > $(this).position().left) ? (minX = $(this).position().left) : (minX = minX);
				(maxX < $(this).position().left+$(this).width()) ? (maxX = $(this).position().left+$(this).width()) : (maxX = maxX);
				(minY > $(this).position().top) ? (minY = $(this).position().top) : (minY = minY);
				(maxY < $(this).position().top+$(this).height()) ? (maxY = $(this).position().top+$(this).height()) : (maxY = maxY);
			});

			midX = (maxX-minX)/2;
			midY = (maxY-minY)/2;

			dX = $(".main .map").width()/2 - (minX + midX);
			dY = $(".main .map").height()/2 - (minY + midY);

			if(minX + dX < 0) {
				dX = dX - (minX + dX);
			}
			if(minY + dY < 0) {
				dY = dY - (minY + dY);
			}

			$(".main .map .module.topologied").each(function(itr) {
				$(this).css({
					top: $(this).position().top + dY,
					left: $(this).position().left + dX
				});
			});
		}

		function sortUntopologiedModules() {
			var topoFlag = false;

			$(".main .map .module:not(.topologied)").css({
				top: $(".main .map .module.network").position().top,
				left: $(".main .map .module.network").position().left
			});			

			$(".main .map .module:not(.topologied)").each(function(itr) {
				if($(this).hasClass("con")) {
					// moveModule();
					// return false;
				}

				var x = 10;
				var y = 10;

				while(!isPlaceable(x, y)) {
					if(x <= $(".main .map").width()-120) {
						x += 70;
					} else {
						x = 10;
						y += 86;
					}
				}

				$(this).css({
					top: y,
					left: x
				});
			});

			$(".topologied").removeClass("topologied");
		}

		function isPlaceable(x, y) {
			var endX = x+60;
			var endY = y+76;
			var ret = true;

			$(".main .map .module").each(function(itr) {
				var topLeftX = $(this).position().left;
				var topLeftY = $(this).position().top;
				var topRightX = $(this).position().left+60;
				var topRightY = $(this).position().top;
				var bottomLeftX = $(this).position().left;
				var bottomLeftY = $(this).position().top+76;
				var bottomRightX = $(this).position().left+60;
				var bottomRightY = $(this).position().top+76;
				
				if((x <= bottomRightX)&&(bottomRightX <= x+60)&&(y <= bottomRightY)&&(bottomRightY <= y+76)) {
					ret = false;
					return false;
				} else if((x <= bottomLeftX)&&(bottomLeftX <= x+60)&&(y <= bottomLeftY)&&(bottomLeftY <= y+76)) {
					ret = false;
					return false;
				} else if((x <= topRightX)&&(topRightX <= x+60)&&(y <= topRightY)&&(topRightY <= y+76)) {
					ret = false;
					return false;
				} else if((x <= topLeftX)&&(topLeftX <= x+60)&&(y <= topLeftY)&&(topLeftY <= y+76)) {
					ret = false;
					return false;
				}
			});

			return ret;
		}

		function rotateRight90(data, itr) {
			var convData = data;
			var i;

			if(itr === undefined) {
				i = 1;
			}

			for(i = 0; i < itr; i++) {
				var temp = convData.u;
				convData.u = convData.l;
				convData.l = convData.d;
				convData.d = convData.r;
				convData.r = temp;
			}

			return convData;
		}
	}

	function changeStatus(uuid, status) {
		var main = require('main');
		$(".map .module").each(function(itr) {
			if($(this).data("uuid") == uuid) {
				if(status) {
					$(this).addClass("con");
					$(this).removeClass("discon");
				}
				else {
					$(this).addClass("discon");
					$(this).removeClass("con");
				}

				return false;
			}
		});

		if(status) {
			main.setPlaced(uuid);
		} else {
			main.unsetPlaced(uuid);
		}
	}

	function getName(uuid) {
		var name = "";
		$(".map .module").each(function() {
			if($(this).data("uuid") == uuid) {
				name = $(this).data("name");
				return false;
			}
		});

		return name;
	}

	function getOsVersion(uuid) {
		var version;
		$(".map .module").each(function() {
			if($(this).data("uuid") == uuid) {
				version = $(this).data("os");
				return false;
			}
		});

		return version;
	}

	function setOsVersion(uuid, version) {
		$(".map .module").each(function() {
			if($(this).data("uuid") == uuid) {
				$(this).data("os", version);
				return false;
			}
		});
	}

	function moduleClickHandler(event) {
		console.log("(map.js)module click handler");
		if($(event.target).attr("class") == "exit") {
			return;
		}

		var monitoring = require("monitoring");
		var module = $(event.target).closest(".module");
		var uuid = module.data("uuid");
		var type = module.data("subtype");
		var name = module.data("name");
		var classes = module.attr("class");

		monitoring.open(type, name, classes);

		event.stopPropagation();
	}

	function mapEventBind() {
		$(".map .mapTab .tabModulemap").on("click", showModulemapHandler);
		$(".map .mapTab .tabLiverot").on("click", showLiverotHandler);
		$(".map").on("click", ".module", moduleClickHandler);
		$(".map").on("click", ".module .exit", deleteModuleHandler);
	}

	$(document).ready(function() {
		mapEventBind();

		if( cordova.isCordova()) {
			$(".map .tabModulemap").text("");
			$(".map .tabLiverot").text("");
			$(".map .modulemap").addClass("show");
			$(".map .tabModulemap").addClass("show");
			mapM.toggleMap();
			mapM.toggleMobileBackground();
		}

	});

	$(window).resize(function() {
	});

	return {
		placeModule: placeModule,
		direction: direction,
		changeStatus: changeStatus,
		moveModule: moveModule,
		setTopologyData: setTopologyData,
		getTopologyData: getTopologyData,
		toggleLiveModuleMap: toggleLiveModuleMap,
		getName: getName, 
		getOsVersion: getOsVersion,
		setOsVersion: setOsVersion,
		mapEventBind: mapEventBind
	};
});