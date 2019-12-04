var mode_hover;
var mode;
$(function() {
	$('#back_img').hover(function() {
		$('#back').css('background', '#438DCB');
	}, function() {
		$('#back').css('background', '#002E73');
	});
	$('#back').hover(function() {
		$('#back').css('background', '#438DCB');
	}, function() {
		$('#back').css('background', '#002E73');
	});

	$('#continue_img').hover(function() {
		$('#continue').css('background', '#7ECEF4');
	}, function() {
		$('#continue').css('background', '#448ACA');
	});
	$('#continue').hover(function() {
		$('#continue').css('background', '#7ECEF4');
	}, function() {
		$('#continue').css('background', '#448ACA');
	});

	$(".rect").hover(function(e) {
		mode_hover = e.target.id.slice(-2);
		$("#square" + mode_hover).css("background", "#FFCC66");
	}, function() {
		$("#square" + mode_hover).css("background", "white");
	});

	$(".char").hover(function(e) {
		mode_hover = e.target.id.slice(-2);
		$("#square" + mode_hover).css("background", "#FFCC66");
	}, function() {
		$("#square" + mode_hover).css("background", "white");
	});

	$(".rect").click(function(e) {
		mode = e.target.id.slice(-2);
		$("#img" + mode).fadeIn(600);
	})

	$(".char").click(function(e) {
		mode = e.target.id.slice(-2);
		$("#img_1").fadeOut(300);
		$("#img_2").fadeOut(300);
		$("#img_3").fadeOut(300);
		$("#img" + mode).fadeIn(300);
		$("#square" + mode).css("background", "#FFCC66");
		$("#key").attr("href", "mode" + mode + ".html");
	})
});