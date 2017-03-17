define(["jquery"], function($) {
	function isCordova() {
		var electron = require('electron');

		return electron.isElectron() === false && document.URL.indexOf( 'http://' ) === -1;
	}

	function loadConfig(cb){
	}

	function saveConfig(config, cb) {
	}

	function createBuildTemplate(cb) {
	}

	function deleteBuildTemplate(path) {		
	}

	function getBuilderPath(){
	}

	function getLibraryPath(){
	}

	function readyDirectory(){
		
	}

	// cordova 의존하는 모듈에 대한 외부 export
	return {
		isCordova: isCordova,
		readyDirectory: readyDirectory,
		loadConfig: loadConfig,
		saveConfig: saveConfig,
		createBuildTemplate: createBuildTemplate,
		deleteBuildTemplate: deleteBuildTemplate,
		getBuilderPath: getBuilderPath,
		getLibraryPath: getLibraryPath
	};
});