define(["jquery", "ide", 'console', "electron", 'map', 'monitoring', 'loading'], function($, ide, console, electron, map, monitoring, loading) {
  console.log("DAEMON INIT");

  var server_;
  var net_;
  var path_;

  var port_ = 39999;
  var messageBuffer_ = "";

  var daemonSocket_;
  var buildlistCallback_;
  var buildUpdateCallback_;
  var buildTemplateCallback_;
  var bin_ = {};
  var connect_ = {};
  var buildState_ = false;

  var topoTimer;

  var property = {
    LUX_BUTTON_CLICK: 2,
    LUX_BUTTON_DBLCLICK: 3,
    LUX_BUTTON_PUSH: 4,
    LUX_BUTTON_TOGGLE: 5,

    LUX_DIAL_DEGREE: 2,
    LUX_DIAL_SPEED: 3,

    LUX_IR_DIST: 2,
    LUX_IR_BRIGHT: 3,

    LUX_ULTRASONIC_DIST: 2,

    LUX_ENVIRONMENT_BRIGHT: 2,
    LUX_ENVIRONMENT_RED: 3,
    LUX_ENVIRONMENT_GREEN: 4,
    LUX_ENVIRONMENT_BLUE: 5,
    LUX_ENVIRONMENT_TEMPER: 6,
    LUX_ENVIRONMENT_HUMID: 7,
    LUX_ENVIRONMENT_ENVIR: 8,

    LUX_GYRO_ROLL: 2,
    LUX_GYRO_PITCH: 3,
    LUX_GYRO_YAW: 4,
    LUX_GYRO_GYROX: 5,
    LUX_GYRO_GYROY: 6,
    LUX_GYRO_GYROZ: 7,
    LUX_GYRO_ACCELX: 8,
    LUX_GYRO_ACCELY: 9,
    LUX_GYRO_ACCELZ: 10,
    LUX_GYRO_VIBRATION: 11,

    LUX_MIC_VOLUME: 2,
    LUX_MIC_FREQUENCE: 3,

    LUX_DISPLAY_CURSORX: 2,
    LUX_DISPLAY_CURSORY: 3,

    LUX_LED_RED: 2,
    LUX_LED_GREEN: 3,
    LUX_LED_BLUE: 4,
    LUX_LED_RGB: 16,

    LUX_MOTOR_RTORQUE: 2,
    LUX_MOTOR_RSPEED: 3,
    LUX_MOTOR_RDEGREE: 4,
    LUX_MOTOR_LTORQUE: 10,
    LUX_MOTOR_LSPEED: 11,
    LUX_MOTOR_LDEGREE: 12,
    LUX_MOTOR_TORQUE: 16,
    LUX_MOTOR_SPEED: 17,
    LUX_MOTOR_ANGLE: 18,

    LUX_SPEAKER_VOLUME: 2,
    LUX_SPEAKER_FREQ: 3,
    LUX_SPEAKER_BUZZER: 16,

    LUX_DISPLAY_POSITION: 16,
    LUX_DISPLAY_TEXT: 17,
    LUX_DISPLAY_DRAWING: 18,
    LUX_DISPLAY_DATA: 19,

    LUX_NETWORK_DATA: 2,
    LUX_NETWORK_EVENT: 3,

    F_DO_1: 32,
    F_RE_1: 36,
    F_MI_1: 41,
    F_PA_1: 43,
    F_SOL_1: 48,
    F_RA_1: 55,
    F_SO_1: 61,
    F_DO_S_1: 34,
    F_RE_S_1: 39,
    F_PA_S_1: 46,
    F_SOL_S_1: 52,
    F_RA_S_1: 58,
    F_DO_2: 65,
    F_RE_2: 73,
    F_MI_2: 82,
    F_PA_2: 87,
    F_SOL_2: 97,
    F_RA_2: 110,
    F_SO_2: 123,
    F_DO_S_2: 69,
    F_RE_S_2: 77,
    F_PA_S_2: 92,
    F_SOL_S_2: 103,
    F_RA_S_2: 116,
    F_DO_3: 130,
    F_RE_3: 146,
    F_MI_3: 165,
    F_PA_3: 174,
    F_SOL_3: 196,
    F_RA_3: 220,
    F_SO_3: 247,
    F_DO_S_3: 138,
    F_RE_S_3: 155,
    F_PA_S_3: 185,
    F_SOL_S_3: 207,
    F_RA_S_3: 233,
    F_DO_4: 261,
    F_RE_4: 293,
    F_MI_4: 329,
    F_PA_4: 349,
    F_SOL_4: 392,
    F_RA_4: 440,
    F_SO_4: 493,
    F_DO_S_4: 277,
    F_RE_S_4: 311,
    F_PA_S_4: 369,
    F_SOL_S_4: 415,
    F_RA_S_4: 466,
    F_DO_5: 523,
    F_RE_5: 587,
    F_MI_5: 659,
    F_PA_5: 698,
    F_SOL_5: 783,
    F_RA_5: 880,
    F_SO_5: 988,
    F_DO_S_5: 554,
    F_RE_S_5: 622,
    F_PA_S_5: 739,
    F_SOL_S_5: 830,
    F_RA_S_5: 932,
    F_DO_6: 1046,
    F_RE_6: 1174,
    F_MI_6: 1318,
    F_PA_6: 1397,
    F_SOL_6: 1567,
    F_RA_6: 1760,
    F_SO_6: 1975,
    F_DO_S_6: 1108,
    F_RE_S_6: 1244,
    F_PA_S_6: 1479,
    F_SOL_S_6: 1661,
    F_RA_S_6: 1864,
    F_DO_7: 2093,
    F_RE_7: 2349,
    F_MI_7: 2637,
    F_PA_7: 2793,
    F_SOL_7: 3135,
    F_RA_7: 3520,
    F_SO_7: 3951,
    F_DO_S_7: 2217,
    F_RE_S_7: 2489,
    F_PA_S_7: 2959,
    F_SOL_S_7: 3322,
    F_RA_S_7: 3729,

    MODULE_NETWORK: 0x0000,
    MODULE_ENV: 0x2000,
    MODULE_INERTIA: 0x2010,
    MODULE_MIC: 0x2020,
    MODULE_BUTTON: 0x2030,
    MODULE_DIAL: 0x2040,
    MODULE_ULTRASONIC: 0x2050,
    MODULE_IR: 0x2060,
    MODULE_MOTOR: 0x2070,
    MODULE_LED: 0x4010,
    MODULE_SPEAKER: 0x4020
  };

  setInterval(function disconnectHandler(){
    if ( !buildState_ ) {
      for (var obj in connect_){
        newT = new Date().getTime();
        oldT = connect_[obj].ping;
        if (oldT === undefined){
          continue;
        }
        // console.log(newT-oldT);
        if (newT - oldT > 3500){
          // disconnect
          console.log("DC");
          map.changeStatus(connect_[obj].uuid, false);
          unsetConnect(connect_[obj].uuid);
        }
      }
    }
  }, 1000);

  function setBuildState( bool ){
    buildState_ = bool;
  }

  function setConnect( categoryT, moduleT, subT, connectT, port, id, uuid ) {
    var ret = false;

    if (connect_[port] === undefined){
      connect_[port] = {};
    }
    if (connect_[uuid] === undefined){
      connect_[uuid] = {};
    }

    // var uuid = Number("0x"+uuid);
    var obj = connect_[uuid];
    obj.uuid = uuid;
    obj.id = id;
    obj.port = port;
    obj.categoryT = categoryT;
    obj.moduleT = moduleT;
    obj.subT = subT;
    obj.connectT = connectT;

    if (obj.first === undefined){
      console.log("CC");
      map.changeStatus(obj.uuid, true);
      obj.first = true;
      ret = true;
    }

    if (connect_[port] === undefined){
      connect_[port] = {};
    }

    connect_[port][id] = uuid;

    return ret;
  }

    // function typeOf(x){
    //  return Object.prototype.toString.call(x).slice(8,-1);
    // }

  function unsetConnect( id, port ) {
    var obj = connect_[id];
    if (port !== undefined && connect_[port] !== undefined){
      obj = connect_[port][id];
    }
    if (obj === undefined)
      return;

    delete(connect_[obj.port][obj.id]);
    delete(connect_[obj.uuid]);
  }

  function getConnect() {
    return connect_;
  }

  function getConnectedNetworkModule(){
    var retArr = [];

    for (var port in connect_){
      var lists = connect_[port];
      var check = lists.port;
      if (check === undefined){
        for (var id in lists){
          var module = isConnect(id, port);
          if (module !== undefined){
          if (module.categoryT == "network"){
              retArr.push(module.uuid);
            }    
          }
        }
      }
    }

    return retArr;
  }

  function monitoringOn(uuid, prop) {
    var module = isConnect(uuid);

    if(module) {
      send(daemonSocket_, genMonitoringOn(module.port, module.id, prop));
    }
  }

  function monitoringOff(uuid) {
    var module = isConnect(uuid);

    if(module) {
      send(daemonSocket_, genMonitoringOff(module.port, module.id));
    }
  }

  function isConnect(id, port) {
    var uuid = id;
    if (port !== undefined){
      if (connect_[port] === undefined){
        return undefined;
      }
      uuid = connect_[port][id];
    }

    return connect_[uuid];
  }

  function updateTopology(id, port, topoObj){
    var obj = isConnect(id, port);
    var topoObjUUID = {};
    // var srcModule = isConnect(id, port);
    // var srcTopo = map.getTopologyData(srcModule.uuid);

    // for (var direction in topoObj){
    //   if(srcTopo[direction] !== 65535) {
    //     if(topoObj[direction] == 65535) {
    //       map.changeStatus(srcTopo[direction], false);
    //     }
    //   }
    // }

    if (obj !== undefined){
      for (var direction in topoObj){
        var id = topoObj[direction];
        var module = isConnect(id, port);
        if (module !== undefined){
          topoObjUUID[direction] = module.uuid;
        }else{
          topoObjUUID[direction] = id;
        }
      }

      // if(topoObjUUID.u^topoObjUUID.d^topoObjUUID.r^topoObjUUID.l) {
        map.setTopologyData(obj.uuid, topoObjUUID);
        moveModule();
      // } else {

      // }
    }
  }

  function moveModule() {
    clearTimeout(topoTimer);
    topoTimer = setTimeout(function() {
      map.moveModule();
    }, 1000);
  }

  // function getTopology(port){
  //  var ret = {};

  //  var lists = connect_[port];
  //  if (lists === undefined){
  //    // Do nothing for empty
  //  }else{
  //    for (var id in lists){
  //      ret[lists[id].uuid] = lists[id].topology;
  //    }
  //  }

  //  return ret;
  // }

  function updateHealth(id, port){
    var obj = isConnect(id, port);

    if (obj !== undefined){
      obj.ping = new Date().getTime();
      return;
    }

    // first, connect
    send( daemonSocket_, genRequestUUID(port, id) );
  }

  function addBuffer( messageString ) {
    messageBuffer_ += messageString;
  }

  function b64DecodeUnicode(str) {
      return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  }

  function b64EncodeUnicode(str) {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
          return String.fromCharCode('0x' + p1);
      }));
  }

  function getJson() {
    while ( true ) {
      var index = messageBuffer_.search( '{' );

      // 찾지 못한다면, 버퍼를 모두 버리고, false 리턴
      if ( index === -1 ) {
        messageBuffer_ = "";
        return false;
      }

      // 찾으면 prefix 기준 이하는 버리고, 찾음 리턴
      messageBuffer_ = messageBuffer_.slice( index );

      // 그 다음 }를 찾아서 충분히 받아 졌는지 확인
      index = messageBuffer_.search( '}' );
      if ( index === -1 ) {
        return false;
      }

      // {}를 추출
      index = index + 1;
      var jsonString = messageBuffer_.slice( 0, index );
      messageBuffer_ = messageBuffer_.slice( index );

      var json;
      try {
        json = JSON.parse( jsonString );
      }catch(e) {
        return false;
      }

      if ( json.c === undefined ){
        return false;
      }

      return json;
    }
  }

  /**
   * INFO json 생성, ide 이름과 버전 포함
   * @method genINFO
   */
  function genINFO() {
    var obj = {};
    obj.c = 0x21; // INFO

    obj.name = ide.getConfig("__name");
    obj.version = ide.getConfig("__version");

    return JSON.stringify( obj );
  }

  /**
   * ERROR json 생성, error 내용 포함 
   * @method genERROR
   */
  function genERROR( errorMsg ) {
    var obj = {};
    obj.c = 0x44; // ERROR

    obj.what = errorMsg;

    return JSON.stringify( obj );
  }

  function genRequestBuildList( luxc ) {
    var obj = {};
    obj.c = 0x23; 
    
    obj.luxc = b64EncodeUnicode(luxc);

    return JSON.stringify(obj);
  }

  function genRequestBuildTemplate(path) {
    var obj = {};
    obj.c = 0x29; 
    
    obj.path = b64EncodeUnicode(path);

    return JSON.stringify(obj);
  }

  function genBuildRequest( path, type, uuid ) {
    var obj = {};
    obj.c = 0x22;

    obj.path = b64EncodeUnicode(path);
    obj.type = type;
    obj.uuid = uuid;

    return JSON.stringify(obj);
  }

  function genBuildUpdateRequest( uuid, id, from, os, mode ) {
    var obj = {};
    obj.c = 0x25;

    obj.uuid = uuid;
    obj.id = id;
    obj.from = from;
    obj.os = os;
    obj.mode = mode;

    return JSON.stringify(obj);
  }

  function genCANRedirect( object, from ){
    var obj = {};
    obj.c = 0x27;

    obj.from = from;
    obj.b64 = b64EncodeUnicode(JSON.stringify(object));

    return JSON.stringify(obj);
  }

  function genRequestNetworkModule(port){
    var obj = {};
    obj.c = 0x28;

    obj.s = 0;
    obj.d = 0;
    obj.b = "";
    obj.l = 0;

    return genCANRedirect(obj, port);
  }

  function genRequestTopology(port){
    var obj = {};
    obj.c = 0x07;

    obj.s = 0;
    obj.d = 0xFFF;
    obj.b = "";
    obj.l = 0;

    return genCANRedirect(obj, port);
  }

  function genRequestNetworkTopology(port){
    var obj = {};
    obj.c = 0x2A;

    obj.s = 0;
    obj.d = 0xFFF;
    obj.b = "";
    obj.l = 0;

    return genCANRedirect(obj, port);
  }

  function genRequestUUID( port, id ) {
    var obj = {};
    obj.c = 0x08;

    var buffer = new ArrayBuffer(8);
    var view = new Uint16Array(buffer, 0, 4);
    view[0] = id;
    var b64 = btoa(ab2str(buffer));

    obj.s = 0;
    obj.d = 0xFFF;
    obj.b = b64;
    obj.l = 8;

    return genCANRedirect(obj, port);
  }

  function genAllModuleUpdateState(port, id) {
    var obj = {};
    obj.c = 0x09;

    var buffer = new ArrayBuffer(1);
    var view = new Uint8Array(buffer);
    view[0] = 0x04;   // update mode로 변경
    var b64 = btoa(ab2str(buffer));

    obj.s = 0;
    obj.d = id;
    obj.b = b64;
    obj.l = 1;

    return genCANRedirect(obj, port);
  }

  function genAllModuleUpdateReadyState(port, id) {
    var obj = {};
    obj.c = 0x09;

    var buffer = new ArrayBuffer(1);
    var view = new Uint8Array(buffer);
    view[0] = 0x05;   // update mode시에 보내는 warning 멈춤
    var b64 = btoa(ab2str(buffer));

    obj.s = 0;
    obj.d = id;
    obj.b = b64;
    obj.l = 1;

    return genCANRedirect(obj, port);
  }

  function genAllModuleResetState(port) {
    var obj = {};
    obj.c = 0x09;

    var buffer = new ArrayBuffer(1);
    var view = new Uint8Array(buffer);
    view[0] = 0x06;
    var b64 = btoa(ab2str(buffer));

    obj.s = 0;
    obj.d = 0xFFF;
    obj.b = b64;
    obj.l = 1;

    return genCANRedirect(obj, port);
  }

  function genOsUpdate( path, type, uuid, id, from, os, mode ) {
    var obj = {};
    obj.c = 0x61;

    obj.path = b64EncodeUnicode(path);
    obj.type = type;
    obj.uuid = uuid;
    obj.id = id;
    obj.from = from;
    obj.os = os;
    obj.mode = mode;

    return JSON.stringify(obj);
  }

  function genMonitoringOn(port, id, prop) {
    var obj = {};
    obj.c = 0x13;

    var buffer = new ArrayBuffer(4);
    var view = new Uint8Array(buffer);
    view[0] = 0x01;
    view[2] = 0x04;     // frequecy: 10ms
    var b64 = btoa(ab2str(buffer));

    obj.d = id;
    obj.b = b64;
    obj.s = property[prop];
    obj.l = 4;

    return genCANRedirect(obj, port);
  }

  function genMonitoringOff(port, id) {
    var obj = {};
    obj.c = 0x13;

    var buffer = new ArrayBuffer(1);
    var view = new Uint8Array(buffer);
    view[0] = 0x00;
    var b64 = btoa(ab2str(buffer));

    obj.d = id;
    obj.b = b64;
    obj.s = 0;
    obj.l = 1;

    return genCANRedirect(obj, port);
  }

  function type2strArr( type ) {    
    var category = type[0] >> 13;
    var module = (type[0] >> 4) & 0x1FF;
    var swDec = type[1];
    var swBin = (swDec >>> 0).toString(2);
    var swOct = (swDec >>> 0).toString(8);
    var swHex = (swDec >>> 0).toString(16);

    var categoryArr = ["network", "input", "output"];

    var networkArr = ["usb", "usb/wifi/ble"];
    var inputArr = ["environment", "gyro", "mic", "button", "dial", "ultrasonic", "ir"];
    var outputArr = ["display", "motor", "led", "speaker"];
    var moduleArr = [networkArr, inputArr, outputArr];

    return [categoryArr[category], moduleArr[category][module], moduleArr[category][module], swDec];
  }

  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  function LP2PConvert( object ) {
    var LPobj = b64DecodeUnicode(object.message);
    LPobj = JSON.parse(LPobj);
    var obj = {};

    // id
    obj.id = LPobj.s;
    // ready byte array
    var byteTemp = atob(LPobj.b);
    var buffer = str2ab(byteTemp);

    switch(LPobj.c){
    case 0x00:
      obj.c = 0xFF;
      updateHealth( obj.id, object.from );
      // console.log("HELLO: " +obj.id);
      // console.log("ROT_CMD_HEALTH");
      break;
    case 0x0A:
      // console.log("Warning State");
      updateHealth( obj.id, object.from );
      var module = isConnect(obj.id, object.from);
      var type = new Uint8Array(buffer, 6, 1)[0];
      console.log("Warning type: " + type, "daemon.js");
      if (module !== undefined){ // WARNING READY
        module.warn = type;
      }
    case 0x05:
      console.log("ROT_CMD_ASSIGN_ID", "daemon.js");
      console.log("ID: "+obj.id);
      obj.c = 0x70;
      // type, uuid, category, module, sw
      var type;
      if(buffer.byteLength == 8) {    // module state 정상일때
        type = new Uint16Array(buffer, 4, 2);
      } else {    // module state led가 빨강일때
        type = new Uint16Array(buffer, 4, 1);
      }
      var arr = type2strArr(type);

      obj.category = arr[0];
      obj.module = arr[1];
      obj.sub = arr[2];
      obj.uuid = Number("0x" + (type[0]).toString(16) + (new Uint32Array(buffer, 0, 1)[0]).toString(16));
      obj.from = object.from;
      obj.os = arr[3];
      break;
    case 0x07:
      console.log("TOPOLOGY", "daemon.js");
      obj.c = 0xFF;
      var topo = new Uint16Array(buffer, 0, 4);
      console.log("TP: " + obj.id + ", " +JSON.stringify(topo));
      updateTopology(obj.id, object.from, {
        'u': topo[1],
        'd': topo[3],
        'l': topo[2],
        'r': topo[0]
      });
      break;
    case 0x13:
      console.log("MONITORING", "daemon.js");
      obj.c = 0xFF;
      var data = new Uint16Array(buffer, 0, 1);
      if(data > 1000) data = data - 65535;
      monitoring.update(data/10);
      break;
    default:
      obj.c = LPobj.c;
      break;
    }

    return obj;
  }

  function getBinary(object) {
    if (bin_[object.uuid] === undefined){
      bin_[object.uuid] = [];
    }

    var arr = bin_[object.uuid];
    arr.push({
      id: object.id,
      data: atob(object.part),
      size: object.size
    });

    arr.sort(function(a, b){
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });

    var wholeSize = 0;
    arr.forEach(function(item, index){
      wholeSize += item.size;
    });

    if ( wholeSize == object.whole_size){
      var data = '';
      arr.forEach(function(item, index){
        data += item.data;
      });     
      delete(bin_[object.uuid]);
      return data;
    }else{
      return false;
    }
  }

  function reconnectAllModules(networkuuid){
    if (networkuuid === undefined){
      var arr = getConnectedNetworkModule();
      arr.forEach(function(uuid){
        var mod = isConnect(uuid);
        if (mod === undefined) return;
        send(daemonSocket_, genRequestNetworkModule(mod.port));
        send(daemonSocket_, genAllModuleResetState(mod.port));
      });
    }

    var module = isConnect(networkuuid);
    if (module){
      var port = module.port;
      for(var id in connect_[port]){
        var mod = isConnect(id, port);
        unsetConnect(mod.uuid);
      }
      send(daemonSocket_, genRequestNetworkModule(module.port));
      send(daemonSocket_, genAllModuleResetState(module.port));
    }
  }

  function resetWarns(uuids){
    uuids.forEach(function(uuid){
      var obj = isConnect(uuid);
      if (obj === undefined){
        return;
      }
      obj.warn = false;
    });
  }

  function isWarnID(uuidid, port){
    var obj = isConnect(uuidid, port);

    if (obj !== undefined){
      return obj.warn;
    }
    return false;
  }

  function handleJsonMessage( socket, object ) {
    var modal = require('modal');
    var resp;

    switch( object.c ) {
    case 0x00:
    case 0x01:
    case 0x02:
    case 0x03:
    case 0x04:
    case 0x05:
    case 0x06:
    case 0x07:
    case 0x08:
    case 0x09:
    case 0x0A:
    case 0x0B:
    case 0x0C:
    case 0x0D:
    case 0x0E:
    case 0x0F:    
    case 0x10:
    case 0x11:
    case 0x12:
    case 0x13:
    case 0x14:
    case 0x15:
    case 0x16:
    case 0x17:
    case 0x18:
    case 0x19:
    case 0x1A:
    case 0x1B:
    case 0x1C:
    case 0x1D:
    case 0x1E:
    case 0x1F:
      // console.log("unprocess message: " + object.c);
      break;
    case 0x20:
      console.log( "HELLO" );
      if ( object.t == 'd' ){
        daemonSocket_ = socket;       
      }
      resp = genINFO();

      requirejs(["builder"], function(builder){
        builder.ready();
      });
      break;
    case 0x24:
      console.log("BUILD_LIST_RESPONSE");
      if ( buildlistCallback_ !== undefined ){
        var list = b64DecodeUnicode( object.list );
        list = JSON.parse(list);
        buildlistCallback_(list);
      }
      return;
    case 0x26:
      console.log("BUILD_BIN_RESPONSE");          
      var bin = getBinary(object);
      if (bin !== false){
        buildCallback_(object.uuid, bin);
      }
      return;
    case 0x27:
      // receive error
      return;
    case 0x30:
      console.log("SERIAL_DISCONNECT");
      var uuids = getConnectedNetworkModule();
      uuids.forEach(function(uuid){
        var networkmodule = isConnect(uuid);
        var port = networkmodule.port;
        if (port == object.port){
          unsetConnect(uuid);
          map.changeStatus(uuid, false);
        }
      });
      modal.resettingNewProjectList(function(){});
      return;
    case 0x40:
      console.log("BUILD_FAIL: " + object.what);
      requirejs(["builder"], function(builder){
        builder.end();
        modal.showUploadUpdateFailed();
        modal.update.appendText("Build Fail: " + object.what);  
      });     
      return;
    case 0x50:
      console.log("BUILD_SUCCESS");
      // buildCallback_(object.uuid);
    case 0x51:
      console.log("COMPILE_COMPLETE");
      // console.log(object.type + object.uuid);
      return;
    case 0x55:
      console.log("BUILD_UPDATE_COMPLETE");
      buildUpdateCallback_(object.uuid);
      return;
    case 0x59:
      console.log("BUILD_TEMPLATE_COMPLETE");
      buildTemplateCallback_();
      var modal = require('modal');
      loading.end();
      modal.openModal(".main");
      return;
    case 0x62:
      console.log("OS_UPDATE_COMPLETE");
      osUpdateCallback_();
      return;
    case 0x63:
      console.log("OS_UPDATE_FAIL");
      return;
    case 0x64:
      console.log("OS_UPDATE_FAIL_REASON");
      return;
    case 0x70:
      console.log("CONNECT_INFO");
      console.log(object);
      var main = require('main');
      main.moduleNotification(object.module, object.uuid);
      // main.moduleNotification(object.module);
      var bFirst = setConnect( object.category, object.module, object.sub, "usb", object.from, object.id, object.uuid);
      if (bFirst === true){
        requestModulesTopology(object.from);
        // map.moveModule();
      }
      if (object.category == "network"){
        modal.resettingNewProjectList(function(){});
      }
      if(object.sub === "usb") {
        map.placeModule({
          uuid: object.uuid,
          id: object.id,
          name: "network",
          title: "hardware",
          subtitle: object.category,
          type: object.module,
          subtype: object.sub,
          from: object.from,
          os: object.os,
          status: true
        });
      }
      else {
        map.placeModule({
          uuid: object.uuid,
          id: object.id,
          name: object.module,
          title: "hardware",
          subtitle: object.category,
          type: object.module,
          subtype: object.sub,
          from: object.from,
          os: object.os,
          status: true
        });
      }
      moveModule();
      // console.log("PLACE: "+res);
      return;
    case 0x71:
      console.log("BUILD_FAIL_REASON");
      modal.update.appendText("BUILD FAIL REASON [" + object.uuid + "]: " + b64DecodeUnicode(object.what));
      return;
    case 0x80:
      // console.log("LP2P_CONVERT");
      handleJsonMessage(socket, LP2PConvert(object));
      return;
    case 0xFF:
      // ignore
      return;
    default:
      console.log( "UNSUPPORTED_HANDLER: " + object.c );
      resp = genERROR( 'CMD' );
      break;
    }

    send( socket, resp );
  }

  /**
   * 열린 socket에 data를 보냄 
   * @method send
   * @param {Object} socket 연결된 tcp 소켓
   * @param {String} 보낼 data string, 보통 json 형식
   */
  function send(socket, data){
    socket.write(data);
    // var success = !socket.write(data);
    // if (!success){
    //  (function(socket, data){
    //    socket.once('drain', function(){
    //      send(socket, data);
    //    });
    //  })(socket, data);
    // }
  }

  function start() {
    if(server_) {
      server_.close();
    }
    server_ = net_.createServer(function(client) {
      console.log("Client connection:");
      console.log("   local = "+client.localAddress+":"+client.localPort);
      console.log("   remote = "+client.remoteAddress+":"+client.remotePort);

      client.setTimeout(0);
      client.setEncoding('utf8');

      client.on('data', function(data) {
        addBuffer( data );
        // 패킷이 여러개 왔을때 한번에 처리를 위함
        while(true){
          var json = getJson();
          if ( json === false ) // 유효한 json 객체가 없음
            return;
          try{
            handleJsonMessage( client, json );
          }catch(err){}
        }       
      });

      client.on('end', function() {
        console.log('Client disconnected');

        // server_.getConnections(function(err, count){
        //   console.log('Remaining Connections: ' + count);
        // });
      });

      client.on('error', function(err) {
        console.log('Socket Error: ', JSON.stringify(err));

        if(err.code === "ECONNRESET") {
          daemonProcess();
        }
        // TODO general error modal 추가할 것
        // electron.restartApp();
      });  

      client.on('timeout', function() {
        console.log('Socket Timed out');
      });
    });

    function serverListening() {
      console.log('server listening: ' + JSON.stringify(server_.address()));
    }

    server_.on('error', function(e) {
      if (e.code == 'EADDRINUSE') {
        electron.alreadyOpenError();
        electron.quitApp();
        // console.log('Address in use, retrying...');
        // setTimeout(function(){
        //   server_.close();
        //   server_.listen(port_, serverListening);
        // }, 1000);
      }else{
        console.log('server Error: ', JSON.stringify(err));
      }
    });

    server_.listen(port_, serverListening);
  }

  function getBuildList( luxc, callback ){
    buildlistCallback_ = callback;
    send( daemonSocket_, genRequestBuildList( luxc ) );
  }

  // function updateModuleComplete(from, port, id){
  //  if (from == "daemon"){
  //    send( daemonSocket_, genModuleUpdateComplete( port, id ) );     
  //  }
  // }

  function getRandom(num){
    return Math.floor((Math.random() * num) + 1);
  }

  function updateAllModules( type, port, id ){
    if (type == "daemon"){
      send( daemonSocket_, genAllModuleUpdateState( port, id ) );
    }
  }

  function readyBuildTemplate(path, cb){
    buildTemplateCallback_ = cb;
    send( daemonSocket_, genRequestBuildTemplate(path) );
  }

  function updateAllModulesReady( type, port, id ){
    if (type == "daemon"){
      setTimeout(function(){
        send( daemonSocket_, genAllModuleUpdateReadyState( port, id ) );
      }, getRandom(500) );
    }
  }

  function restartAllModules( type, port ){
    if (type == "daemon"){
      send( daemonSocket_, genAllModuleResetState( port ) );
    }
  }

  function requestNetworkTopology( port ) {
    send(daemonSocket_, genRequestNetworkTopology(port));
  }

  function requestModulesTopology( port ) {
    send(daemonSocket_, genRequestTopology(port));
  }

  function build( path, type, uuid, callback ) {
    buildCallback_ = callback;
    send( daemonSocket_, genBuildRequest( path, type, uuid ) );
  }

  function update( uuid, id, from, os, callback ){
    buildUpdateCallback_ = callback;
    send( daemonSocket_, genBuildUpdateRequest(uuid, id, from, os, 1) );
  }

  function plugAndPlay( uuid, id, from, os, callback ){
    buildUpdateCallback_ = callback;
    send( daemonSocket_, genBuildUpdateRequest(uuid, id, from, os, 2) );
  }

  function osUpdate( path, type, uuid, id, from, os, callback ){
    osUpdateCallback_ = callback;
    send( daemonSocket_, genOsUpdate(path, type, uuid, id, from, os, 3) );
  }

  function send2Daemon(data) {
    if(daemonSocket_ !== undefined) {
      send(daemonSocket_, data);
    }
  }

  function daemonProcess() {
    var file = require('file');

    var cp = nodeRequire('child_process');
    var spawn = cp.spawn;
    var exec = cp.exec;
    net_ = nodeRequire('net');
    path_ = nodeRequire('path');
    var daemonName = "LuxRoTDaemon";
    var clearDaemon;

    // var findDaemon = spawn('tasklist', ['/FI', daemonName+".exe"]);
    // findDaemon.stdout.on('data', function(data) {
    //   console.log('findDaemon stdout: ' + data);
    // });
    // findDaemon.stderr.on('data', function(data) {
    //   console.log('findDaemon stderr: ' + data);
    // });
    // findDaemon.on('exit', function(code) {
    //   console.log('child process exited with code ' + code);
    // });

    if ( process.platform == 'win32' ){
      clearDaemon = spawn( 'taskkill', ['/IM', daemonName+".exe", '/F'] );
    } else {
      clearDaemon = spawn( 'killall', [daemonName] );
    }

    clearDaemon.on('exit', function(code) {
      var env = {};
      env.PATH = process.env.PATH;
      env.PATH = file.getBuilderPath() + path_.delimiter + env.PATH;
      var options = { env: env };
      exec('chmod 755 '+ path_.join(file.getLibraryPath(), daemonName), [], function(error, stdout, stderr) {
        var Daemon = spawn( path_.join(file.getLibraryPath(), daemonName) , [], options );

        Daemon.stdout.on('data', function (data) {
          console.log("stdout: " + data);
        });

        Daemon.stderr.on('data', function (data) {
          console.log("stderr: " + data);
        });

        Daemon.on('exit', function (code) {
          console.log("child process exited with code : " + code);
        });
        
        start();
      });
    });
  }

  (function init(){
    
    // Electron and cordova only
    if( electron.isElectron() ) {
      daemonProcess();
    }else if( !!window.cordova ) {
      net_ = require('cordova-chrome-net');
      start();
    }

  })();

  return {
    getBuildList: getBuildList,
    build: build,
    update: update,
    restartAllModules: restartAllModules,
    b64EncodeUnicode: b64EncodeUnicode,
    isConnect: isConnect,
    setConnect: setConnect,
    getConnect: getConnect,
    unsetConnect: unsetConnect,
    setBuildState: setBuildState,
    updateAllModules: updateAllModules,
    updateAllModulesReady: updateAllModulesReady,
    requestNetworkTopology: requestNetworkTopology,
    requestModulesTopology: requestModulesTopology,
    monitoringOn: monitoringOn,
    monitoringOff: monitoringOff,
    resetWarns: resetWarns,
    isWarnID: isWarnID,
    getConnectedNetworkModule: getConnectedNetworkModule,
    reconnectAllModules: reconnectAllModules,
    readyBuildTemplate: readyBuildTemplate,
    plugAndPlay: plugAndPlay,
    osUpdate: osUpdate,
    send2Daemon: send2Daemon
  };
});