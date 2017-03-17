define(["jquery", "console"], function($, console) {
	console.log("COMMUNITY INIT");

	function toggleCommunityHandler(event) {
		console.log("(community.js)toggle community handler");
		// $(".community").toggleClass("show");
		// window.location.reload();
		event.stopPropagation();
	}

	$(document).ready(function() {
		$(".commuBtn").on("click", toggleCommunityHandler);
	});
});