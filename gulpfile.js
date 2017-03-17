'use strict';

// Module 호출
var gulp	= require('gulp');
var jshint	= require('gulp-jshint');
var concat	= require('gulp-concat');
var uglify	= require('gulp-uglify');
var rename	= require('gulp-rename');
var del = require('del');
var connect	= require('gulp-connect');
var open	= require('gulp-open');
var os		= require('os');
var csslint	= require('gulp-csslint');
var concatcss	= require('gulp-concat-css');
var uglifycss	= require('gulp-uglifycss');
var fileinclude = require('gulp-file-include');
var sass    = require('gulp-sass');
var sasslint = require('gulp-sass-lint');
var plumber = require('gulp-plumber');
var amdOptimize = require('gulp-amd-optimizer');
var electron_c	= require('electron-connect').server.create();
var cordova		= require('gulp-cordova');
var replace = require('gulp-replace');

var config	= require('./config.json');

// 기본 옵션, 라이브러리 복사 > livereload 활성화 > 브라우져 오픈 > 지속 관찰
gulp.task('default', ['usage']);
gulp.task('build', ['bower:copy', 'scripts', 'sass_styles', 'styles', 'pages']);
gulp.task('build_mobile', ['bower:copy', 'scripts', 'sass_styles_mobile', 'styles', 'pages']);
gulp.task('browser', ['build', 'serve', 'open', 'watch']);
// electron으로 켜지는 옵션, 절차는 default와 같다
gulp.task('electron', ['build', 'electron_serve', 'electron-watch']);
// cordova
gulp.task('cordova-android', ['build_mobile', 'serve', 'watch', 'cordova-android-open']);
// gulp.task('cordova-ios', ['build_mobile', 'serve', 'watch', 'cordova-ios-open']);

gulp.task('cordova-create', function() {
	// get ip address
	var ifaces      = os.networkInterfaces();
	var lookupIpAddress = null;
	for (var dev in ifaces) {
		// 제외할 network driver 이름
		if( dev.includes("vmnet") || dev.includes("Tunnel") || dev.includes("tunnel") ) {
			continue;
		}

		ifaces[dev].forEach(function(details){
			if ( details.family=='IPv4' && details.mac!='00:00:00:00:00:00' && details.internal == false ) {
				lookupIpAddress = details.address;
			}
		});
	};
	var ipAddress   = lookupIpAddress;

	// cordova 프로젝트 생성
	gulp.src("./")
	.pipe(cordova(["create", config.path.cordova.project, "com.luxrobo.luxrotide", "LUXROBO RoT IDE"]));

	// cordova 프로젝트가 생성되도록 2초간 대기
	setTimeout(function(){
		gulp.src(config.path.cordova.project + "config.xml")
		.pipe(replace(/<content\s+src=\"(.+?)\"\s+\/>/, "<content src=\"http://"+ipAddress+":"+config.browser.port+"\" />"))
		.pipe(replace(/<\/widget>/, "\t<preference name=\"orientation\" value=\"portrait\" />\n</widget>"))
		.pipe(gulp.dest(config.path.cordova.project));

		gulp.src("./")
		.pipe(cordova(["platform", "add", "android", "ios"], {cwd: config.path.cordova.project}));
	}, 2000);	
});

gulp.task('cordova-android-open', function(){
	gulp.src(config.path.cordova.project)
	.pipe(cordova(["run", "android", "--device"], {cwd: config.path.cordova.project}));
});

gulp.task('cordova-ios-open', function(){
	gulp.src(config.path.cordova.project)
	.pipe(cordova(["run", "ios", "--device"], {cwd: config.path.cordova.project}));
});

// 사용법에 대한 간략한 설명
gulp.task('usage', function(){
	console.log("\n\n");
	console.log("$ gulp <browser | electron | cordova-create | cordova-android>\n");
	console.log("for more information, please read README.md\n");
	console.log("더 많은 정보를 얻으려면, README.md를 읽어주시기 바랍니다\n");
	console.log("\n\n");
});

// electron을 실행 및 liverestart
gulp.task('electron_serve', function(){
	electron_c.start();

	gulp.watch(['app.js'], electron_c.restart);
});

// 지속적 관찰 watch 업무 정의
gulp.task('watch', ['clean'], function(){
	gulp.watch(config.path.js.src, ['scripts']);
	gulp.watch(config.path.sass.src, ['sass_styles']);
	gulp.watch(config.path.sass_mobile.src, ['sass_styles_mobile']);
	gulp.watch(config.path.css.src, ['styles']);
	gulp.watch(config.path.html.srcs, ['pages']);
	gulp.watch([config.browser.root+"*", config.path.js.dest+"*", config.path.css.dest+"*"], ['reload', electron_c.reload]);
});

gulp.task('electron-watch', ['clean'], function() {
	gulp.watch(config.path.js.src, ['scripts']);
	gulp.watch(config.path.sass.src, ['sass_styles']);
	gulp.watch(config.path.sass_mobile.src, ['sass_styles_mobile']);
	gulp.watch(config.path.css.src, ['styles']);
	gulp.watch(config.path.html.srcs, ['pages']);
	gulp.watch([config.browser.root+"*", config.path.js.dest+"*", config.path.css.dest+"*"], electron_c.reload);
});

// SASS 컴파일하여 CSS 폴더에 넣어줌
gulp.task('sass_styles', function(){
	gulp.src( config.path.sass.src )
	.pipe( plumber() )
	.pipe(sasslint({
		files: {
			"ignore": "**/_variables.sass"
		},
		rules: {
			"property-sort-order": 0,
			'nesting-depth': 0,
			'class-name-format': 0
		}
	}))
	.pipe(sasslint.format())
    // .pipe(sasslint.failOnError())
    .pipe( sass().on( 'error', sass.logError ) )
    .pipe( gulp.dest( config.path.sass.dest ) );
  });

// SASS 컴파일하여 CSS 폴더에 넣어줌
gulp.task('sass_styles_mobile', function(){
	gulp.src( config.path.sass_mobile.src )
	.pipe( plumber() )
	.pipe(sasslint({
		files: {
			"ignore": ["**/_variables.sass", "**/_guiblock.sass"]
		},
		rules: {
			"property-sort-order": 0,
			'nesting-depth': 0,
			'class-name-format': 0
		}
	}))
	.pipe(sasslint.format())
    // .pipe(sasslint.failOnError())
    .pipe( sass().on( 'error', sass.logError ) )
    // .pipe( sass() )
    .pipe( gulp.dest( config.path.sass_mobile.dest ) );
  });

// CSS 검사 > 병합 > 압축
gulp.task('styles', function(){
	gulp.src(config.path.css.src)
	.pipe(csslint({
		'bulletproof-font-face': false,
		'adjoining-classes': false,
		'duplicate-background-images': false,
		'box-sizing': false,
		'known-properties': false ,
		'unqualified-attributes': false ,
		'important': false 
	}))
	.pipe(csslint.reporter())			// 문법 검사
	// .pipe(csslint.reporter('fail'))
	.pipe(concatcss(config.path.css.filename))	// 병합
	.pipe(gulp.dest(config.path.css.dest))
	.pipe(uglifycss())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(config.path.css.dest));		// 압축
});

// JAVASCRIPT 검사 > 병합 > 압축
gulp.task('scripts', function(){
	var requireConfig = {
		baseUrl: config.path.js.src.substring(0, config.path.js.src.search("\\*")),
		paths: {
			"jquery": "../../" + config.path.js.dest + "jquery.min",
			"jqueryui": "../../" + config.path.js.dest + "jquery-ui.min",
			"jsplumb": "../../" + config.path.js.dest + "jsPlumb-2.1.4",
			"jquerysieve": "../../" + config.path.js.dest + "jquery.sieve.min",
			"slidepro": "../../" + config.path.js.dest + "jquery.sliderPro.min",
			"ace": "../../" + config.path.js.dest + "/ace/ace",
			"jqueryuitouchpunch": "../../" + config.path.js.dest + "jquery.ui.touch-punch.min",
			"nestable-sortable": "../../" + config.path.js.dest + "nestable-sortable",
			"colorpicker": "../../" + config.path.js.dest + "jquery.wheelcolorpicker",
			"hammerjs": "../../" + config.path.js.dest + "/hammer",
			"touchpunch": "../../" + config.path.js.dest + "jquery.ui.touch-punch",
			"dygraph": "../../" + config.path.js.dest + "dygraph",
			"jquerycontextmenu": "../../" + config.path.js.dest + "jquery.contextMenu"
		},
		exclude: [
		"jquery",
		"jqueryui",
		"jsplumb",
		"jquerysieve",
		"slidepro",
		"ace",
		"jqueryuitouchpunch",
		"nestable-sortable",
		"colorpicker",
		"hammerjs",
		"touchpunch",
		"dygraph",
		"jquerycontextmenu"
		]
	};
	var options = {
		umd: false
	};

	gulp.src(config.path.js.src)
	.pipe(plumber())
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))	// 문법 검사
	.pipe(amdOptimize(requireConfig, options))	// AMD 트리화
	.pipe(concat(config.path.js.filename))		// 병합
	.pipe(gulp.dest(config.path.js.dest))
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))			// 압축
	.pipe(gulp.dest(config.path.js.dest));
});

// HTML 병합
gulp.task('pages', function(){
	gulp.src( config.path.html.src )
	.pipe( fileinclude( {
		prefix: "@@",
		basepath: "@file"
	} ) )
	.pipe( gulp.dest( config.path.html.dest ) );
});

// 폴더, 파일 제거
gulp.task('clean', function() {
	del(['dist/index.html', 'dist/js/ide.js', 'dist/js/ide.min.js', 'dist/css/ide.css', 'dist/css/ide.min.css']);
});

// 변경된 파일이 있다면, live reload를 부른다
gulp.task('reload', function(){
	gulp.src(config.browser.root+"*")
	.pipe(connect.reload());
});

// LiveReload 웹 서버
gulp.task('serve', function(){
	connect.server({
		root: config.browser.root,
		port: config.browser.port,
		livereload: config.browser.livereload
	});
});

// 브라우져 오픈 업무, chrome으로 열려고 노력한다
gulp.task('open', function(){
	var browser = os.platform() === 'linux' ? 'google-chrome' : (
		os.platform() === 'darwin' ? 'google chrome' : (
			os.platform() === 'win32' ? 'chrome' : 'firefox'));
	var options = {
		uri: 'http://localhost:'+config.browser.port,
		app: browser
	};
	gulp.src(config.browser.root+'index.html')
	.pipe(open(options));
});

// 기 설치된 Bower Package 복사 
gulp.task('bower:copy', function () {
	var ref = config.bower;
	var path = ref.path;
	for (var name in ref){
        // 올바른 형식을 가지고 있는지 검사한다.
        var obj = ref[name];
        if (typeof obj === "object"){
        	gulp.src(path + obj.src)
        	.pipe(gulp.dest(obj.dest));
        }
      }
    });
