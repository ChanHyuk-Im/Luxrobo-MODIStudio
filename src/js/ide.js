define(["jquery", "console", 'file'], function($, console, file) {
	console.log("IDE INIT", "ide.js");

	var config_;

	function getConfig( key ) {
		return config_[key];
	}

	(function init() {
		file.loadConfig(function(config){
			config_ = JSON.parse(config);

			// global config
			// config_.__name = "LUXROBO RoT IDE";
			// config_.__version = 1;
		});		
	})();

	return {
		getConfig: getConfig
	};
});