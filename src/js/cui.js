define(["jquery", "console", "ace", "nestable-sortable"], function($, console, ace, nestable) {
	console.log("CUI INIT");

	function getCurrentAction() {
		return $(".action").not(".off");
	}

	function getActionSource(actionId) {
		gui = $("#"+actionId);
		serialized = gui.nestable("serialize");
		return JSON.stringify(serialized, null, ' ');
	}

	function createAceAction() {
		console.log("(cui.js) create Ace Action");
		var aceEditor = ace.edit("actionEditor");
		aceEditor.setOptions({
			mode: "ace/mode/c_cpp",
			theme: "ace/theme/sqlserver",
			autoScrollEditorIntoView: true,
			useSoftTabs: false,
			showInvisibles: true,
			fontSize: 15
		});


		// $(".editor > .body > .list .aceEditor").css({"width": $(".editor > .body .list .gui").width()});
		// $(".editor > .body > .list .aceEditor").css({"height": $(".editor > .body .list .gui").height()});
		// $(".editor"+name).parent().parent().parent().css({"padding": "20px 0 0 14px"});
	}

	function setTextCurrentAction( string ) {
		aceEditor = ace.edit("actionEditor");
		aceEditor.setValue(string);
	}

	function setAceSize() {
		$(".aceEditor").css({
			"width": "100%",
			"height": "100%"
		});
		$(".ace_content").css({
			"width": "100%",
			"height": "100%"
		});
		$(".ace_scrollbar-v").css({
			"width": "6px"
		});
		$(".ace_scrollbar-h").css({
			"height": "6px"
		});
	}

	return {
		createAceAction: createAceAction,
		setTextCurrentAction: setTextCurrentAction,
		getActionSource: getActionSource,
		setAceSize: setAceSize
	};
});