define(['jquery', "console", 'daemon'], function($, console, daemon) {

	var bSuccess_;
	var path_;
	var port_;
	var updateState_;
	var updateMode_ = 1;

	var osVersion;

	function build( path, list ) {
		var map = require('map');
		var modal = require('modal');

		param = list.shift();

		if (param === undefined){
			// 모든 param을 꺼냈다는 것은 모든 처리를 완료했다는 것 
			if ( bSuccess_ ){			
				modal.showUploadUpdateSuccess();
				modal.update.appendText("Build Success");
			}else{
				modal.showUploadUpdateFailed();
				modal.update.appendText("Build Fail");
			}
			end();
			return;
		}

		modal.update.appendText("build request:" + map.getName(param.uuid));		
		daemon.build( path, param.type, param.uuid, function( uuid, binary ) {

			modal.update.appendText("build complete: " + map.getName(param.uuid));
			module = daemon.isConnect( Number(uuid) );
			if ( module !== undefined ) {

				function updateModule(){
					var func;
					var os = map.getOsVersion(module.uuid);

					switch(updateMode_){
					case 2:
						func = plugAndPlay;
						break;
					case 1:
					default:
						func = update;
						break;
					}
					if(osVersion !== os) {
						modal.update.appendText("OS update start: " + map.getName(param.uuid));
						osUpdate(path, param.type, module.uuid, module.id, module.port, osVersion, function(uuid){
							map.setOsVersion(module.uuid, osVersion);
							modal.update.appendText("OS update complete: " + map.getName(param.uuid));
							modal.update.appendText("Firmware update start: " + map.getName(param.uuid));
							func( binary, module.mtype, module.port, module.uuid, module.id, osVersion, function(uuid){
								modal.update.appendText("Firmware update complete: " + map.getName(param.uuid));
								build( path, list );
							});
						});
					} else {
						modal.update.appendText("Firmware update start: " + map.getName(param.uuid));
						func( binary, module.mtype, module.port, module.uuid, module.id, osVersion, function(uuid){
							modal.update.appendText("Firmware update complete: " + map.getName(param.uuid));
							build( path, list );
						});
					}
				}
				// 연결되어 있을 경우에만 업데이트
				modal.update.appendText("update request: " + map.getName(param.uuid));
				var time = 0;

				if ( updateState_ === false ){
					port_ = module.port;
					var uuids = [param.uuid];
					list.forEach(function(item){
						uuids.push(item.uuid);
					});
					daemon.resetWarns(uuids);

					daemon.updateAllModules("daemon", port_, 0xFFF);

					var count = 0;					
					var type = 1;
					var id = setInterval(function(){
						var recv = uuids.every(function(uuid){
							var warnid = daemon.isWarnID(Number(uuid));
							var bRet = (warnid == type);
							var module = daemon.isConnect(uuid);
							if (bRet === false && module !== undefined){
								if (type == 1){
									daemon.updateAllModules("daemon", port_, module.id);
									// daemon.updateAllModules("daemon", port_, 0xFFF);
								}else if(type == 2){
									daemon.updateAllModulesReady("daemon", port_, module.id);
								}
							}
							return bRet;
						});
						if (!recv){
							// if fail
							if (type == 2){
								// if (count % 5 == 0){
									// daemon.updateAllModulesReady("daemon", port_);
								// }
							}
							count++;
							if (count >= 30){
								clearInterval(id);
								modal.update.appendText("change update mode error: " + type);
								bSuccess_ = false;
								list = []; // 끝냄
								build(path, list);
							}
							return;
						}
						
						if (type == 1){
							count = 0;
							type = 2;
							// daemon.updateAllModulesReady("daemon", port_, 0xFFF);
							daemon.updateAllModules("daemon", port_, 0xFFF);
						}
						else if (type == 2){
							// if success
							updateState_ = true;
							clearInterval(id);
							updateModule();
						}
					}, 400);
				}else{
					updateModule();
				}						
			}else{
				bSuccess_ = false; // 하나라도 연결되어 있지않다면, 성공이 아닌 것 
				modal.update.appendText("missing module: " + map.getName(param.uuid));
				build( path, list );
			}
		});
	}

	function update( binary, type, from, uuid, id, os, cb ){	
		daemon.update( uuid, id, from, os, cb);
	}

	function plugAndPlay( binary, type, from, uuid, id, os, cb ){
		daemon.plugAndPlay( uuid, id, from, os, cb);
	}

	function setUpdateMode(mode){
		updateMode_ = mode;
	}

	function begin( luxc ) {
		var modal = require('modal');
		var app = nodeRequire('electron').remote.app;
		var versions = app.getVersion().split(".");

		// osVersion = Number(app.getVersion().replace(/[.]/g, ""));
		osVersion = Number(versions[1]*1000) + Number(versions[2]);

		// 리스트 얻음
		bSuccess_ = true;
		modal.update.appendText("build list request");
		daemon.setBuildState(true);
		
		port_ = undefined;
		updateState_ = false;

		daemon.getBuildList( luxc, function( list ) {					
			modal.update.appendText("build list response");
			build( path_, list );
		});	
	}

	function end() {
		daemon.restartAllModules("daemon", port_);
		daemon.setBuildState(false);
		// file.deleteBuildTemplate( path_ );
		// file.clearBuildTemplates();
		// title.enableUpload(false);
		// ready();
	}

	function ready(){
		var file = require('file');
		var title = require('title');

		path_ = undefined;
		file.createBuildTemplate(function(path){
			daemon.readyBuildTemplate(path, function(){				
				title.enableUpload(true);
				path_ = path;
			});
		});
	}

	function rebootAllModules() {
		if(port_ !== undefined) {
			daemon.restartAllModules("daemon", port_);
		}
	}

	function requestNetworkTopology() {
		if(port_ !== undefined) {
			daemon.requestNetworkTopology(port_);
		}
	}

	function requestModulesTopology() {
		if(port_ !== undefined) {
			daemon.requestModulesTopology(port_);
		}
	}

	function osUpdate( path, type, uuid, id, port, os, cb ) {
		daemon.osUpdate(path, type, uuid, id, port, os, cb);
	}

	function osBegin() {
		var title = require('title');

		oSuccess_ = true;
		console.log("os update request");
		daemon.setBuildState(true);

		port_ = undefined;
		updateState_ = false;
		osUpdate( path_, title.genOsUpdateList());
	}

	return {
		ready: ready,
		begin: begin,
		end: end,
		setUpdateMode: setUpdateMode,
		rebootAllModules: rebootAllModules,
		requestNetworkTopology: requestNetworkTopology,
		requestModulesTopology: requestModulesTopology,
		osBegin: osBegin
	};
});