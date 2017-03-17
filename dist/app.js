'use strict';

const electron = require('electron');
// // Module to control application life.
const app = electron.app;

const ipc = electron.ipcMain;
const dialog = electron.dialog;

// // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// var app = require('app');
// var BrowserWindow = require('browser-window');

const childProcess = require('child_process');
const path = require('path');

const log = require('electron-log');
const {autoUpdater} = require('electron-updater');

const appFolder = path.resolve(process.execPath, '..');
const rootFolder = path.resolve(appFolder, '..');
const exeName = path.basename(process.execPath);

childProcess.exec('set GH_TOKEN=d58d8810f038f6b731a21b21c494485b0cb78ca2');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const spawn = function(command, args) {
  let spawnedProcess, error;

  try {
    spawnedProcess = childProcess.spawn(command, args, {detached: true});
  } catch(error) { }

  return spawnedProcess;
}

const spawnUpdate = function(args) {
  let updateDotExe = path.resolve(path.join(rootFolder, 'Update.exe'));

  return spawn(updateDotExe, args);
}

const spawnVc = function() {
  const exec = childProcess.exec;
  let vcDotExe = path.resolve(path.join(appFolder, 'resources/vc_redist.x86.exe'));

  return exec(vcDotExe);
}

const spawnVcp = function() {
  const exec = childProcess.exec;
  let vcpDotExe = path.resolve(path.join(appFolder, 'resources/vcp_setup_x64.exe'));

  // if((process.arch == 'ia32')||(process.arch == 'x86')) {
  //   vcpDotExe = path.resolve(path.join(appFolder, 'resources/VCP_V1.3.1_Setup.exe'));
  // } else if(process.arch == 'x64') {
  //   vcpDotExe = path.resolve(path.join(appFolder, 'resources/VCP_V1.3.1_Setup_x64.exe'));
  // }
  return exec(vcpDotExe);
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
var daemonName = "LuxRoTDaemon.exe";

if (handleStartupEvent()) {
  return;
}

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
  mainWindow.loadURL('file://' + __dirname + '/index.html');

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
}

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});
autoUpdater.on('update-available', (ev, info) => {
  log.info('Update available.');
});
autoUpdater.on('update-not-available', (ev, info) => {
  log.info('Update not available.');
});
autoUpdater.on('error', (ev, err) => {
  log.info('Error in auto-updater.');
});
autoUpdater.on('download-progress', (ev, progressObj) => {
  log.info('Download progress...');
});
autoUpdater.on('update-downloaded', (ev, info) => {
  log.info('Update downloaded; will install in 5 seconds');
});

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

autoUpdater.on('update-downloaded', (ev, info) => {
  setTimeout(function() {
    autoUpdater.quitAndInstall();
  }, 5000);
});

app.on('ready', function() {
  autoUpdater.checkForUpdates();
});

function closeDaemon() {
  if ( process.platform == 'win32' ){
    spawn( 'taskkill', ['/IM', '/F', daemonName] );
  } else {
    spawn( 'killall', [daemonName] );
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

ipc.on('already-opened', function(event) {
  dialog.showErrorBox('MODI Studio Error.', 'MODI Studio is already opened.');
});

ipc.on('quit-app', function(event) {
  app.quit();
});

ipc.on('openDialog', function(event, args) {
  console.log(event);
  openDialog(args);
});

function openDialog(args) {
  const options = {
    type: 'none',
    title: 'MODI Studio',
    message: args,
    buttons: ['Close'],
    icon: './icon/icon.ico'
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

function handleStartupEvent() {
  if (process.platform !== 'win32') {
    return false;
  }

  var squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case '--squirrel-install':
      spawnVcp();
      spawnVc();
    case '--squirrel-updated':
      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus
      spawnUpdate(['--createShortcut', exeName]);
      // Always quit when done
      app.quit();
      // setTimeout(app.quit(), 1000);
      return true;
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      spawnUpdate(['--removeShortcut', exeName]);
      // Always quit when done
      setTimeout(app.quit(), 1000);
      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit();
      return true;
  }
};