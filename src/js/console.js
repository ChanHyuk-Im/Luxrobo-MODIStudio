define([], function() {
	log("CONSOLE INIT", "console.js");
	var debug = 1;		// 0: Disable log, 1: Enable log

	function log(content, fileName) {
		if(debug) {
			if(fileName === undefined) {
				fileName = '';
			}
			if(typeof(content) == "object") {
				console.log(content);
			}
			else {
				console.log("["+new Date().toLocaleString()+"]"+" "+content+" ["+fileName+"]");
			}
		}
	}

	function warning(content, fileName) {
		if(debug) {
			if(fileName === undefined) {
				fileName = '';
			}
			if(typeof(content) == "object") {
				console.warn(content);
			}
			else {
				console.warn("["+new Date().toLocaleString()+"]"+" "+content+" ["+fileName+"]");
			}
		}
	}

	function error(content, fileName) {
		if(debug) {
			if(fileName === undefined) {
				fileName = '';
			}
			if(typeof(content) == "object") {
				console.error(content);
			}
			else {
				console.error("["+new Date().toLocaleString()+"]"+" "+content+" ["+fileName+"]");
			}
		}
	}

	return {
		log: log,
		warning: warning,
		error: error
	};
});