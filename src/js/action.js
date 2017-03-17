define(["jquery", "console", "editor", "cui", 'cordova', 'actionM'], function($, console, editor, cui, cordova, actionM) {
	console.log("ACTION INIT");

	function newActionHandler(event) {
		console.log("(action.js)new action handler");
		var name = "newAction";
		createAction(name);
		if(event !== undefined) {
			event.stopPropagation();
		}
	}

	/**
		delete data and index in array.
	*/
	Array.prototype.delete = function(data) {
		var index;

		for(index = 0; index < this.length; index++) {
			if(this[index] == data) {
				this.splice(index, 1);
				break;
			}
		}
	};

	var actionArray = [];

	/**
		create action.

		* data type
			- name : string
			- type : string
			- condition html
	*/
	function createAction(name) {
		var elem = $('<div class="action dd dd-active"> <div class="gui"> <ul class="root dd-list" data-blockcount="2"> <li class="helper dd-item dd-nochildren" data-langNum="140"> Drag and drop a block here </li> </ul> </div> <ul class="cui" style="display: none;"> <div id="actionEditor" class="aceEditor"> </div> </ul> </div>').appendTo(".editor .body .list");
		// var helperElem = $('<div class="helper">Drag and drop a block here</div>').appendTo(".editor .body .list");
		editor.setNestable();
	}


	$(document).ready(function() {

		if(cordova.isCordova()) {
		}

		cui.setAceSize();
	});

	function getActionArray() {
		return actionArray;
	}

	function setActionArray(array) {
		actionArray = array;
	}

	$(window).resize(function() {
		cui.setAceSize();
	});

	return {
		newActionHandler: newActionHandler,
		getActionArray: getActionArray,
		setActionArray: setActionArray
	};
});