define(["jquery", "console", "jsplumb"], function($, console, jsPlumb) {
	console.log("PLUMB INIT");

	var mapInstance;

	/**
		setting jsPlumb configuration.
	*/
	jsPlumb.ready(function() {
		mapInstance = jsPlumb.getInstance({
			Endpoint: ["Dot", {radius: 1}],
			EndpointStyle: {fill: "#26cad3"},
			Connector: ["Flowchart", {cornerRadius: 20, gap: 2, stub: 10}],
			Container: ".modulemap"
		});

		mapInstance.on("click", function(event) {
			mapInstance.detach(event);
		});

		// var modules = jsPlumb.getSelector(".modulemap .mapmodule");
		// mapInstance.batch(function() {
		// 	var i;
		// 	for(i = 0; i < modules.length; i++) {
		// 		initPlumbMapmodule(mapInstance, modules[i]);
		// 	}
		// });
	 
		// connectMapmodules(mapInstance, "testmodule1", "testmodule2");
	});

	/**
		connect two modules.

		* instance : jsPlumb instance
		* sourceID : source ID
		* targetID : target ID
	*/
	function connectMapmodules(instance, sourceID, targetID) {
		instance.registerConnectionType("mapBasic", {anchor: "Continuous", connector: "StateMachine"});

		instance.connect({source: sourceID, target: targetID, type: "mapBasic"});
		$(".map path").attr("stroke", "#26cad3");
		$(".map path").attr("stroke-dasharray", "1 9");
		$(".map path").attr("stroke-linecap", "round");
	}

	/**
		initializing a module on map.

		* insatnce : jsPlumb instance
		* element : module that want to initializing
	*/
	function initPlumbMapmodule(instance, element) {
		// instance.draggable(element, {
		// 	drag: function(event) {
		// 		// console.log(event.e.toElement);
		// 	},
		// 	start: function(event) {
		// 		console.log("dragstart");
		// 	},
		// 	helper: function() {
		// 		return $(this).clone().appendTo(".body");
		// 	}
		// });
		instance.makeSource(element, {
			filter: "none",
			anchor: "Continuous",
			connectorStyle: {stroke: "#26cad3", lineWidth: 4},
			connectionType: "mapBasic",
			maxConnections: 1000
		});
		instance.makeTarget(element, {
			dropOptions: {hoverClass: "dragHover"},
			anchor: "Continuous",
			maxConnections: 1000
		});
	}

	function getAllConnectionsData(instance) {
		var connObject = {};
		var connections = instance.getAllConnections();

		for(itr = 0; itr < connections.length; itr++) {
			connObject[connections[itr].sourceId] = [];
		}

		for(itr = 0; itr < connections.length; itr++) {
			connObject[connections[itr].sourceId].push(connections[itr].targetId);
		}

		return connObject;
	}

	function connAllConnections(instance, connObject) {
		for(var itr in connObject) {
			for(itr1 = 0; itr1 < connObject[itr].length; itr1++) {
				connectMapmodules(instance, itr, connObject[itr][itr1]);
			}
		}
		instance.repaintEverything();
	}

	function detachAllConnections(instance) {
		instance.deleteEveryEndpoint();
	}

	function redrawAllConnections(instance) {
		var itr;
		var itr1;
		var connObject = {};

		connObject = getAllConnectionsData(instance);
		detachAllConnections(instance);
		connAllConnections(instance, connObject);
		$(".map path").attr("stroke", "#26cad3");
	}

	function serialize() {
		var serial = [];
		var modules = [];
		var connections = [];

		$(".modulemap .module").each(function(index, el) {
			var $el = $(el);
			var classes = $(this).attr("class").split(/\s+/);
			var data = $(this).data();
			data["ui-draggable"] = "";
			modules.push({
				data: data,
				position: $(this).position()
			});
		});

		$.each(mapInstance.getAllConnections(), function(index, connection) {
			connections.push({
				connectionId: connection.id,
				srcId: connection.sourceId,
				dstId: connection.targetId
			});
		});

		serial.push({
			modules: modules,
			connections: connections
		});

		return serial;
	}

	return {
		mapInstance: mapInstance,
		initPlumbMapmodule: initPlumbMapmodule,
		connectMapmodules: connectMapmodules,
		getAllConnectionsData: getAllConnectionsData,
		connAllConnections: connAllConnections,
		detachAllConnections: detachAllConnections,
		redrawAllConnections: redrawAllConnections,
		serialize: serialize
	};
});