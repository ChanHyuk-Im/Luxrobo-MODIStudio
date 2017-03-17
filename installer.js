var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
	appDirectory: './bin/win-ia32-unpacked',
	outputDirectory: './bin/win-ia32-installer',
	loadingGif: './dist/image/loading/R256.png',
	authors: 'LUXROBO Co., Ltd.',
	exe: 'Luxrobo Modi Studio.exe',
	setupExe: 'MODI Studio.exe',
	version: '0.1.0',
	setupIcon: './build/icon.ico'
});

resultPromise.then(function() {
	console.log("It worked!");
}, function(e) {
	console.log("No dice: " + e.message);
});