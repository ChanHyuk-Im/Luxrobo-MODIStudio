// 단독으로 쓰이지 않으며, electron 의존으로 돌아간다. 따라서 electron.js에서 export한 것으로 사용할 것
define(["jquery", "console", "electron", "cordova"], function($, console, electron, cordova) {
	console.log("FILE INIT", "file.js");

	var framework_;

	// // 주의!
	// // xxxPath들은 절대경로이며 마지막에 Delimiter를 포함합니다.
	// // ex) C:\Users\WWhale\AppData\Roaming\LuxRoTIDE\workspace\

	// var programDirectoryName = "LuxRoTIDE";	// workspace 디렉토리의 상위 디렉토리
	// var workspaceDirectoryName = "workspace"; // workspace 디렉토리의 이름
	// var thumbnailDirectoryName = "thumbnails"; // appPath 내에 존재하는 썸네일 이미지를 저장하는 디렉토리의 이름
	// var buildRootDirectoryName = "luxbuild"; // builder에서 사용하는 임시 디렉토리의 최상위 경로 
	// var skeletonzipName = "skeleton.zip";
	// var thumbnailExtensionName = "png";

	// var configName = "config.json"; // User의 환경설정을 저장

	// var currentProject = null;			// 현재 프로젝트의 디렉토리 이름을 저장
	// var pathDelimiter = null;			// 플랫폼에 맞는 path delimiter를 저장
	

	// /**
	// * 프로젝트의 이름을 인자로 받아 thumbnail 생성 
	// *
	// * @method createThumbnail
	// * @param {String} name thumbnail 생성할 프로젝트의 이름
	// */
	// function createThumbnail( projectName ){
	// 	// TODO thumbnail 생성 
	// }

	// /**
	// * 프로젝트의 이름을 인자로 받아 workspacePath에 project 디렉토리 및 thumbnail 생성 
	// *
	// * @method createProject
	// * @param {String} name 생성할 프로젝트의 이름
	// * @return {Boolean} 성공여부 
	// */
	// function createProject( name ) {
	// 	if ( isExist(name, workspacePath) ){
	// 		// 존재하면 실패 
	// 		return false;
	// 	}
	// 	createDirectory( name, workspacePath );
	// 	createThumbnail( name );
	// 	return true;
	// }

	// /**
	// * setCurrentProject 메소드는 프로젝트의 이름을 인자로 받아 현재 작업중인 프로젝트의 이름을 설정한다.
	// *
	// * @method setCurrentProject
	// * @param {String} projectName 현재 작업중인 프로젝트 이름
	// */
	// function setCurrentProject(projectName) {
	// 	// 현재 작업중인 프로젝트로 입력 받은 프로젝트의 이름을 설정한다.
	// 	// 반환 true:해당 프로젝트 이름이 존재하였고 이를 프로젝트 이름으로 설정했음.
	// 	currentProject = projectName;
	// }

	// /**
	// * getCurrentProject 메소드는 현재 작업중인 프로젝트의 이름을 반환한다.
	// *
	// * @method getCurrentProject
	// * @return {String} 현재 작업중인 프로젝트의 이름을 반환(절대경로가 아님)
	// */
	// function getCurrentProject() {
	// 	// 현재 작업중인 프로젝트의 이름을 반환한다.
	// 	return currentProject;
	// }

	/**
	* 환경설정을 불러온다
	*
	* @method loadConfig
	* @return 파일을 읽고, utf8 string을 반환
	*/
	function loadConfig(cb) {
		framework_.loadConfig(cb);
	}

	/**
	* 환경설정을 저장
	*
	* @method saveConfig
	* @param {String} utf8 string to save
	*/
	function saveConfig(config, cb) {
		framework_.saveConfig(config, cb);
	}

	/**
	* 파일에 저장한다.
	*
	* @method saveToFile
	* @param {String} filePath 파일이 저장되길 원하는 절대경로
	* @param {String} fileContent 파일에 저장될 내용
	*/
	function saveToFile(filePath, fileContent, cb) {
		framework_.saveToFile(arguments);
	}

	/**
	* 파일을 읽어서 반환해준다.
	* loadFromFile은 가변인자 함수다.
	* 한개 혹은 두개의 인자를 가질 수 있다.
	* 첫번째 인자는 filePath이고, 두번째 인자는 options로 인코딩 타입 혹은 플래그를 결정한다.
	* ref. https://nodejs.org/api/fs_.html#fs__fs__readfilesync_file_options
	*
	* @method loadFromFile
	* @param {String} filePath 읽어오고 싶은 파일의 절대경로
	* @return {Object} 인코딩 방식을 지정하지 않을 경우(default) 바이트 값이 배열에 담겨 반환
	* @return {String} utf8과 같은 인코딩 타입을 지정하면 해당 인코딩 타입으로 파일을 읽어 반환
	*/
	function loadFromFile(filePath) {	
		framework_.loadFromFile(arguments);
	}

	function createProject(name, content, cb) {
		framework_.createProject(name, content, cb);		
	}

	function deleteProject(name) {
		framework_.deleteProject(name);
	}

	function saveProject(name, content, cb) {
		framework_.saveProject(name, content, cb);
	}

	function getProjectList(cb) {
		framework_.getProjectList(cb);
	}

	function openProject(name, cb) {
		framework_.openProject(name, cb);
	}

	function saveRecentFile(name, cb) {
		framework_.saveRecentFile(name, cb);
	}

	function saveMonitoringData(data, cb) {
		framework_.saveMonitoringData(data, cb);	
	}

	function deleteRecentProject(name, cb) {
		framework_.deleteRecentProject(name, cb);
	}

	function openRecentFile(cb) {
		framework_.openRecentFile(cb);
	}

	function isProjectExist(name) {
		framework_.isProjectExist(name);
	}

	// /**
	// * 최근 작업한 순으로 프로젝트들에 대한 정보를 넘겨준다.
	// *
	// * @method getAllProject
	// * @return {Object} 이름(name), 썸네일경로(thumbnailPath), 수정시간(mtime)를 객체 배열로 반환
	// */
	// function getAllProject() {
	// 	var projects = [];

	// 	fs_.readdirSync(thumbnailPath).forEach(function(file){
	// 		projects.push({
	// 			name: file.substring(0, file.lastIndexOf(".")),
	// 			thumbnailPath: thumbnailPath + file,
	// 			mtime: fs_.statSync(thumbnailPath + file).mtime.getTime()
	// 		});
	// 	});

	// 	projects.sort(function (a, b) {
	// 		if (a.mtime < b.mtime)
	// 			return -1;
	// 		else
	// 			return 1;
	// 	});

	// 	return projects;
	// }

	/**
	* build하기 전에 Template zip_을 이용하여 temporary template directory 생성 
	*
	* @method createBuildTemplate
	* @param cb {Function} 만들어진 template directory path를 인자로 가지는 callback function
	*/
	function createBuildTemplate(cb) {
		framework_.createBuildTemplate(cb);
	}

	/**
	* temporary template directory의 이름(핸들값)을 받아서 해당 디렉토리를 삭제
	*
	* @method deleteBuildTemplate
	* @param path {String} 지울 template directory path
	*/
	function deleteBuildTemplate( path ) {
		framework_.deleteBuildTemplate(path);
	}

	function getBuilderPath(){
		return framework_.getBuilderPath();
	}

	function getLibraryPath(){
		return framework_.getLibraryPath();
	}

	// /**
	// * 프로젝트를 삭제하는 경우 호출된다.
	// * 프로젝트가 삭제되면 다음과 같은 작업이 동반되어야 한다.
	// * 1. workspace 내에 있는 프로젝트의 디렉토리 삭제
	// * 2. Project Thumb 내에 있는 썸네일 파일 삭제 
	// *
	// * @method deleteProject
	// * @param {String} projectName 삭제할 프로젝트의 이름
	// */
	// function deleteProject(projectName) {
	// 	unlink( workspacePath + projectName );
	// 	unlink( thumbnailPath + projectName + "." + thumbnailExtensionName );
	// }
	
	function clearBuildTemplates(){
		framework_.clearBuildTemplates();
	}

	(function init(){
		if(electron.isElectron()) {
			framework_ = electron;
		} else if(cordova.isCordova()) {
			framework_ = cordova;
		}

		framework_.readyDirectory();
	})();
	
	return { 
		loadConfig: loadConfig,
		saveConfig: saveConfig,
		createBuildTemplate: createBuildTemplate,
		deleteBuildTemplate: deleteBuildTemplate,
		getBuilderPath: getBuilderPath,
		getLibraryPath: getLibraryPath,
		saveProject: saveProject,
		createProject: createProject,
		deleteProject: deleteProject,
		saveRecentFile: saveRecentFile,
		saveMonitoringData: saveMonitoringData,
		deleteRecentProject: deleteRecentProject,
		openRecentFile: openRecentFile,
		isProjectExist: isProjectExist,
		getProjectList: getProjectList,
		openProject: openProject,
		clearBuildTemplates: clearBuildTemplates
	};
});

