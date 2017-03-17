'use strict';

const electron = require('electron');
// // Module to control application life.
const app = electron.app;

const ipc = electron.ipcMain;
const dialog = electron.dialog;

// // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const path = electron.path;
// var app = require('app');
// var BrowserWindow = require('browser-window');

var client = require('electron-connect').client;
var spawn = require('child_process').spawn;
var execUpdate = require('child_process').exec;
var execVc = require('child_process').exec;

// CUSTOM Config
var config  = require('./config.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    minWidth: 910, 
    height: 768,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      zoomFactor: 1.0
    }
  });

  // and load the index.html of the app.
  //mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.loadURL('file://' + __dirname + '/' + config.browser.root + '/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // electron-connect
  client.create(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    app.quit();
  // }
});

function closeDaemon() {
  if ( process.platform == 'win32' ){
    spawn( 'taskkill', ['/IM', '/F', config.daemon.name] );
  } else {
    spawn( 'killall', [config.daemon.name] );
  }
}

// X버튼 누르면 꺼지도록 함에 따라서, Deprecated
// app.on('activate', function () {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

app.on('quit', function ( event, exitCode ) {
  closeDaemon();
});

ipc.on('restart-MODISTUDIO', function(event) {
  mainWindow.reload();
});

ipc.on('openDialog', function(event, args) {
  console.log(event);
  openDialog(args);
});

ipc.on('already-opened', function(event) {
  dialog.showErrorBox('Modi Studio Error.', 'Modi Studio is already opened.');
});

ipc.on('quit-app', function(event) {
  app.quit();
});

function openDialog(args) {
  const options = {
    type: 'none',
    title: 'MODI Studio',
    message: args,
    buttons: ['Close']
    // icon: './build/icon.ico'
  };

  dialog.showMessageBox(options, function (index) {});
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // 어플리케이션을 중복 실행했습니다. 주 어플리케이션 인스턴스를 활성화 합니다.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
  return true;
});

var handleStartupEvent = function() {
  if (process.platform !== 'win32') {
    return false;
  }

  var squirrelCommand = process.argv[1];
  
  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':

      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      target = path.basename(process.execPath);
      updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
      // vcDotExe = path.resolve(path.dirname(process.execPath), 'resources/app-0.2.16', 'vc_redist.x86.exe');
      var createShortcut = updateDotExe + ' --createShortcut=' + target + ' --shortcut-locations=Desktop,StartMenu';
      // execUpdate(createShortcut);
      // execVc(vcDotExe);

      // Always quit when done
      app.quit();
      return true;
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      target = path.basename(process.execPath);
      updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var removeShortcut = updateDotExe + ' --removeShortcut=' + target;
      execUpdate(removeShortcut);

      // Always quit when done
      app.quit();
      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  return;
}