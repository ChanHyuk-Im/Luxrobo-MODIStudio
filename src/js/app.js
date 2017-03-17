requirejs.config({
	"baseUrl": 'js',
	"paths": {
		"jquery": "jquery.min",
		"jqueryui": "jquery-ui.min",
		"jsplumb": "jsPlumb-2.1.4",
		"jquerysieve": "jquery.sieve.min",
		"slidepro": "jquery.sliderPro.min",
		"ace": "ace/ace",
		"colorpicker": "jquery.wheelcolorpicker",
		"dygraph": "dygraph-combined-dev",
		"jquerycontextmenu": "jquery.contextMenu"
	},
	"shim": {
		'jqueryui': {
			"deps": ['jquery'],
			exports: '$'
		},
		'jsplumb': {
			"deps": ['jquery'],
			exports: '$'
		},
		'jquerysieve': {
			'deps': ['jquery'],
			exports: '$'
		},
		'slidepro': {
			"deps": ['jquery'],
			exports: '$'
		},
		'ace': {
			exports: 'ace'
		},
		'nestable-sortable': {
			"deps": ['jquery'],
			exports: '$'
		},
		'colorpicker': {
			"deps": ['jquery'],
			exports: '$'
		},
		'dygraph': {
			"deps": ['jquery'],
			exports: '$'
		},
		'jquerycontextmenu': {
			"deps": ['jquery'],
			exports: '$'
		}
	}
});

requirejs(["jquery", "console", 'init', 'daemon', 'main'], function($, console, init, daemon, main){
	console.log("IDE USE");
});
