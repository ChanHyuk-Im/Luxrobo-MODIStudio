define(["jquery", "console"], function($, console) {
	if( isElectron() ) {
		var ipc = nodeRequire('electron').ipcRenderer;
	}
	var os_;
	var path_;
	var window_;
	var fs_;
	var remote_;
	var execFile_;
	var zip_;
	var dczip_;

	var programPath;
	var documentsPath;
	var workspacePath;
	var dataPath;
	var thumbnailPath;
	var buildrootPath;
	var libraryPath;
	var configPath;
	var builderPath;

	// var workspacePathName = "workspace"; // workspace 디렉토리의 이름
	var workspacePathName = "Projects"; // workspace 디렉토리의 이름
	var dataPathName = "Data";	// data 디렉토리 이름
	var buildrootPathName = "luxbuild"; // builder에서 사용하는 임시 디렉토리의 최상위 경로
	var skeletonzipName = "skeleton.zip";
	var configName = "config.json";

	function deepObjCopy (dupeObj) {
		var retObj = {};
		if (typeof(dupeObj) == 'object') {
			if (typeof(dupeObj.length) != 'undefined')
				retObj = [];
			for (var objInd in dupeObj) {
				if (typeof(dupeObj[objInd]) == 'object') {
					retObj[objInd] = deepObjCopy(dupeObj[objInd]);
				} else if (typeof(dupeObj[objInd]) == 'string') {
					retObj[objInd] = dupeObj[objInd];
				} else if (typeof(dupeObj[objInd]) == 'number') {
					retObj[objInd] = dupeObj[objInd];
				} else if (typeof(dupeObj[objInd]) == 'boolean') {
					((dupeObj[objInd] === true) ? retObj[objInd] = true : retObj[objInd] = false);
				}
			}
		}
		return retObj;
	}

	function minimizeHandler(event) {
		console.log("(electron.js)minimize handler");
		window_.minimize();
		event.stopPropagation();
	}

	function maximizeHandler(event) {
		console.log("(electron.js)maximize handler");
		if(window_.isMaximized()) {
			window_.unmaximize();
		}
		else {
			window_.maximize();
		}
		if(event !== undefined) {
			event.stopPropagation();
		}
	}

	function quitHandler(event) {
		console.log("(electron.js)quit handler");
		window_.close();
		event.stopPropagation();
	}

	function isElectron() {
		return navigator.userAgent.indexOf("Electron") !== -1;
	}

	function isExist(name, path) {
		if ( path === undefined ){
			path = programPath;
		}

		// 어플리케이션 디렉토리 내에 path가 존재하는지 확인한다.
		try{
			var fullpath = path_.join(path, name);
			fs_.accessSync(fullpath);
			return true;
		}catch(err){
			return false;
		}		
	}

	function isProjectExist(name) {
		return isExist(name+".lsl", workspacePath);
	}

	function createDirectory(name, path, cb) {
		if ( path === undefined ) {
			path = programPath;
		}

		var fullpath = path_.join(path, name);
		if( !isExist( name, path ) ) {
			// 디렉토리가 존재하지 않으므로 새로운 디렉토리 생성 			
			fs_.mkdir(fullpath, undefined, function(){
				cb(fullpath);
			});
		} else {
			cb(fullpath);
		}
	}

	function deleteDirectory(name, path) {
		if ( path === undefined) {
			path = programPath;
		}

		var fullpath = path_.join(path, name);
		if( isExist( name, path ) ) {
			rmdir(fullpath);
			console.log(name+" is removed.");
		} else {
			console.log(name+" is not exist.");
		}
	} 

	function rmdir(dir) {
		var list = fs_.readdirSync(dir);
		
		for(var i = 0; i < list.length; i++) {
			var filename = path_.join(dir, list[i]);
			var stat = fs_.statSync(filename);

			if(filename == "." || filename == "..") {
				// pass these files
			} else if(stat.isDirectory()) {
				// rmdir recursively
				rmdir(filename);
			} else {
				// rm fiilename
				fs_.unlinkSync(filename);
			}
		}
		fs_.rmdirSync(dir);
	}

	function readyDirectory(){
		programPath = remote_.app.getPath('userData');
		configPath = path_.join(programPath, configName);
		documentsPath = path_.join(programPath, "../../../Documents");

		if ( !isExist(configPath, "") ) {
			// 존재하지 않는다면 빈 파일을 만든다 
			saveConfig("{}", function(){});
		}

		createDirectory("Luxrobo", documentsPath, function(path) {
			createDirectory("MODI Studio", path, function(path) {
				createDirectory(workspacePathName, path, function(path){
					workspacePath = path;
					createDirectory(dataPathName, path_.join(path, ".."), function(path) {
						dataPath = path;
						createDirectory(buildrootPathName, os_.tmpDir(), function(path){
							if (os_.type() == 'Windows_NT'){
								var converterPath =  path_.join(libraryPath, 'pathConverter.exe');
								// converterPath = daemon.b64EncodeUnicode(converterPath);
								execFile_(converterPath, [path], function(error, stdout, stderr){
									if (stdout){
										buildrootPath = String(stdout).trim();
									}
								});
							} else {						
								buildrootPath = path;
							}					
						});
					});
				});
			});
		});
	}

	function createBuildTemplate(cb) {
		var dir = buildrootPath + "/temp";
		if( !isExist( "temp", buildrootPath ) ) {
			// 디렉토리가 존재하지 않으므로 새로운 디렉토리 생성 			
			fs_.mkdir(dir);
		}

		var skeletonPath = path_.join(__dirname, skeletonzipName);
		var newSkeletonPath = path_.join(buildrootPath, skeletonzipName);
		var stream = fs_.createReadStream(skeletonPath).pipe(fs_.createWriteStream(newSkeletonPath));

		stream.on('finish', function() {
			console.log("skeleton.zip copy complete");
			unzip(newSkeletonPath, dir, function() {
				cb(dir);
			});
		});

		// zip_.unzip( newSkeletonPath, dir, function(err){
		// 	if ( err === null){
		// 		cb(dir);
		// 	}
		// });
	}

	function deleteBuildTemplate(path) {		
		if ( path === undefined ){			
			unlink( buildrootPath );
		} else {
			unlink( path );
		}
	}

	function getProjectList(cb){
		var retArr = [];
		fs_.readdirSync(workspacePath).forEach(function(file,index){
			// 내부파일 모두 지우기
			var curPath = path_.join(workspacePath, file);
			// if(fs_.lstatSync(curPath).isDirectory()) { // recurse
			// 	retArr.push(file);
			// }
			if(curPath.split('.')[1] === "lsl") {
				retArr.push(file);
			}
		});

		cb(retArr);
	}

	function loadConfig(cb){
		loadFromFile( configPath, "utf8", cb);
	}

	function saveConfig(config, cb) {
		saveToFile( configPath, config, cb);
	}

	function saveToFile(filePath, fileContent, cb) {		
		fs_.writeFile(filePath, fileContent, function(err){
			if (err) cb(false);
			else cb(true);
		});
	}

	function createProject(name, content, cb){
		createDirectory(name, workspacePath, function(path){
			var projectFilePath = path_.join(path, name+".lpr");
			saveToFile(projectFilePath, content, cb);
		});
	}

	function openProject(name, cb){
		var srcPath = path_.join(workspacePath, name+".lsl");
		var dstPath = path_.join(workspacePath, name);

		// unzip(srcPath, dstPath, function() {
		unzip(srcPath, workspacePath, function() {
			// unlink(srcPath);
			createDirectory(name, workspacePath, function(path){
				var projectFilePath = path_.join(path, name+".lpr");
				loadFromFile(projectFilePath, 'utf8', cb, unlink, dstPath);
			});
		});
	}

	function saveProject(name, content, cb){		
		saveRecentFile(name, function(bSuccess) {
			console.log("recent file save result: "+bSuccess);

			createDirectory(name, workspacePath, function(path){
				var projectFilePath = path_.join(path, name+".lpr");
				if(name !== "") {
					saveToFile(projectFilePath, content, cb);
				}

				var projectImagePath = path_.join(path, name+".ltn");
				var html2canvas = nodeRequire('html2canvas');
				html2canvas($("body > .main > .body"), {
					// width: 610,		// 122
					// height: 460,	// 92
					onrendered: function(canvas) {
						var imageData = canvas.toDataURL("image/jpeg", 1.0);
						// saveToFile(projectImagePath, imageData, cb);
						if(name !== "") {
							saveToFile(projectImagePath, imageData, function(ret) {
								zip(path, path+".lsl", function() {
									unlink(path);
									cb(ret);
								});
							});
						} else {
							cb(true);
						}
					}
				});
			});
		});
	}

	function deleteProject(name) {
		// deleteDirectory(name, workspacePath);

		unlink(path_.join(workspacePath, name+".lsl"));
	}

	function openRecentFile(cb) {
		var projectFilePath = path_.join(programPath, "recent.lrt");
		fs_.readFile(projectFilePath, function(err, data) {
			if(err) {
				saveToFile(projectFilePath, "{}");
			}
		});
		loadFromFile(projectFilePath, 'utf8', cb);
	}

	function saveRecentFile(name, cb) {
		var projectFilePath = path_.join(programPath, "recent.lrt");
		var json_ = {
			'1': undefined,
			'2': undefined,
			'3': undefined
		};
		openRecentFile(function(data) {
			if(data) {
				var json = JSON.parse(data);
				 if(name === "") {
				 	json_ = {
						'1': json['1'],
						'2': json['2'],
						'3': json['3']
					};
				 } else if(name == json['1']) {
					json_ = {
						'1': json['1'],
						'2': json['2'],
						'3': json['3']
					};
				} else if(name == json['2']) {
					json_ = {
						'1': json['2'],
						'2': json['1'],
						'3': json['3']
					};
				} else if(name == json['3']) {
					json_ = {
						'1': json['3'],
						'2': json['1'],
						'3': json['2']
					};
				} else {
					json_ = {
						'1': name,
						'2': json['1'],
						'3': json['2']
					};
				}
			} else {
				json_ = {
					'1': name,
					'2': undefined,
					'3': undefined
				};
			}
			data = JSON.stringify(json_);
			saveToFile(projectFilePath, data, cb);
		});
	}

	function deleteRecentProject(name, cb) {
		var projectFilePath = path_.join(programPath, "recent.lrt");
		var json_ = {
			'1': undefined,
			'2': undefined,
			'3': undefined
		};
		openRecentFile(function(data) {
			if(data) {
				var json = JSON.parse(data);
				if(name == json['1']) {
					json_['1'] = json['2'];
					json_['2'] = json['3'];
					json_['3'] = undefined;
				} else if(name == json['2']) {
					json_['1'] = json['1'];
					json_['2'] = json['3'];
					json_['3'] = undefined;
				} else if(name == json['3']) {
					json_['1'] = json['1'];
					json_['2'] = json['2'];
					json_['3'] = undefined;
				} else {
					json_['1'] = json['1'];
					json_['2'] = json['2'];
					json_['3'] = json['3'];
				}

				data = JSON.stringify(json_);
				saveToFile(projectFilePath, data, cb);
			}
		});
	}

	function saveMonitoringData(data, cb) {
		var date = new Date();
		var fileName = date.toDateString()+" "+date.toLocaleTimeString()+".txt";
		fileName = fileName.replace(/[:, ]/g, '_');
		// saveToFile(dataPath+"/"+date.getFullYear()+"_"+date.getMonth()+"_"+date.getDate()+"_"+date.getHours()+"_"+date.getMinutes()+"_"+date.getSeconds()+"_"+date.getMilliseconds()+".txt", data, cb);
		saveToFile(dataPath+"/"+fileName, data, cb);
	}

	// function openConfigFile(cb) {
	// 	var projectFilePath = path_.join(workspacePath, "config.lcg");
	// 	fs_.readFile(projectFilePath, function(err, data) {
	// 		if(err) {
	// 			saveToFile(projectFilePath, "");
	// 		}
	// 	});
	// 	loadFromFile(projectFilePath, 'utf8', cb);
	// }

	// function saveConfigFile(name, cb) {
	// 	var projectFilePath = path_.join(workspacePath, "config.lcg");
	// 	var json_ = {
	// 		'language': 'ko'
	// 	};
	// 	openConfigFile(function(data) {
	// 		if(data) {
	// 			var json = JSON.parse(data);
				
	// 		}
	// 		data = JSON.stringify(json_);
	// 		saveToFile(projectFilePath, data, cb);
	// 	});
	// }

	function loadFromFile(filePath) {
		var length = arguments.length;
		var cb, unlink_, path;

		if(length === 2) {
			cb = arguments[1];
			fs_.readFile(filePath, function(err, data){
				if (err) throw err;
				cb(data);
			});
		} else if(length == 3) {
			cb = arguments[2];
			fs_.readFile(filePath, arguments[1], function(err, data){
				if (err) throw err;
				cb(data);
			});
		} else if(length == 5) {
			cb = arguments[2];
			unlink_ = arguments[3];
			path = arguments[4];
			fs_.readFile(filePath, arguments[1], function(err, data){
				if (err) throw err;
				cb(data);
				unlink_(path);
			});
		}
	}

	function unlink(path) {
		// 존재한다면,
		if( isExist(path, "") ) {			
			if ( fs_.lstatSync(path).isDirectory() ) {
				// 디렉토리라면
				fs_.readdirSync(path).forEach(function(file,index){
					// 내부파일 모두 지우기
					var curPath = path_.join(path, file);
					if(fs_.lstatSync(curPath).isDirectory()) { // recurse
						unlink(curPath);
					} else { // delete file
						fs_.unlinkSync(curPath);
					}
				});

				// 남은 빈 폴더 지우기
				fs_.rmdirSync(path);
			} else {
				// 파일이라면 
				fs_.unlinkSync(path);
			}			
		}
	}

	function getBuilderPath(){
		return builderPath;
	}

	function getLibraryPath(){
		return libraryPath;
	}

	function clearBuildTemplates(){
		// unlink(buildrootPath);
		createDirectory(buildrootPathName, os_.tmpDir(), function(path){
			if(os_.type() == 'Windows_NT') {
				var converterPath =  path_.join(libraryPath, 'pathConverter.exe');
				execFile_(converterPath, [path], function(error, stdout, stderr){
					if (stdout){
						buildrootPath = String(stdout).trim();
					}
				});
			} else {						
				buildrootPath = path;
			}					
		});
	}

	/**
		zipFile: 절대경로(zip 파일 이름 포함. ex)./file.zip )
		dstpath: unzip 결과를 저장할 절대경로
		callback: unzip 완료 후 실행될 callback function
	*/
	function unzip(zipFile, dstPath, callback) {
		var unzipper = new dczip_(zipFile);
		unzipper.on('error', function(err) {
			console.log("unzip error: " + err);
		});
		unzipper.on('extract', function(log) {
			console.log("finish "+zipFile+" extracting to "+dstPath);
			if(callback) {
				callback();
			}
		});
		unzipper.on('progress', function(fileIndex, fileCount) {
			// console.log('extracted file '+(fileIndex+1)+' of '+fileCount);
		});
		unzipper.extract({
			path: dstPath
		});
	}

	function zip(srcFile, zipFile, callback) {
		var zip = new zip_();
			// if(callback) {
			// 	callback();
			// }
			// console.log("Fail to compress "+srcFile);
			zip.zipFolder(srcFile, function() {
				zip.writeToFile(zipFile);
				rmdir(srcFile);
				if(callback) {
					callback();
				}
			});
	}

	function getThumbnail(name, cb) {
		if(name) {
			name = name.split('.')[0];
			var projectPath = path_.join(workspacePath, name);
			var thumbnailPath = path_.join(projectPath, name+".ltn");
			unzip(projectPath+".lsl", workspacePath, function() {
				if(cb) {
					cb(fs_.readFileSync(thumbnailPath, 'utf8'));
				}
				unlink(projectPath);
			});
		}
	}

	function restartApp() {
		if( isElectron() ){
			ipc.send('restart-MODISTUDIO');
		}
	}

	function alreadyOpenError() {
		if( isElectron() ) {
			ipc.send('already-opened');
		}
	}

	function openDialog(string) {
		ipc.send('openDialog', string);
	}

	function quitApp() {
		ipc.send('quit-app');
	}

	if( isElectron() ) {
		console.log("ELECTRON INIT", "electron.js");

		os_ = nodeRequire('os');
		path_ = nodeRequire('path');
		fs_ = nodeRequire('fs');
		// zip_ = nodeRequire('cross-zip');
		zip_ = nodeRequire('easy-zip').EasyZip;
		dczip_ = nodeRequire('decompress-zip');
		execFile_ = nodeRequire('child_process').execFile;

		remote_ = nodeRequire('electron').remote;
		window_ = remote_.getCurrentWindow();

		// libraryPath = path_.dirname(remote_.app.getPath('exe'));
		// libraryPath =  __dirname; // TODO for gulp
		libraryPath =  path_.join(__dirname, "..");

		builderPath = path_.join(libraryPath, 'builder', 'bin');

		$(document).ready(function() {
			if (os_.type() == 'Windows_NT') {
				$(".title .mini").on("click", minimizeHandler);
				$(".title .maxi").on("click", maximizeHandler);
				$(".title .quit").on("click", quitHandler);
			} else {
				$(".title .mini").hide();
				$(".title .maxi").hide();
				$(".title .quit").hide();
			}

			// maximizeHandler();
		});
	}

	// electron 의존하는 모듈에 대한 외부 export
	return {
		isElectron: isElectron,
		readyDirectory: readyDirectory,
		createBuildTemplate: createBuildTemplate,
		deleteBuildTemplate: deleteBuildTemplate,
		loadConfig: loadConfig,
		saveConfig: saveConfig,
		isProjectExist: isProjectExist,
		getBuilderPath: getBuilderPath,
		getLibraryPath: getLibraryPath,
		saveProject: saveProject,
		createProject: createProject,
		deleteProject: deleteProject,
		openRecentFile: openRecentFile,
		saveRecentFile: saveRecentFile,
		saveMonitoringData: saveMonitoringData,
		deleteRecentProject: deleteRecentProject,
		getProjectList: getProjectList,
		openProject: openProject,
		clearBuildTemplates: clearBuildTemplates,
		getThumbnail: getThumbnail,
		restartApp: restartApp,
		alreadyOpenError: alreadyOpenError,
		openDialog: openDialog,
		quitApp: quitApp
	};
});