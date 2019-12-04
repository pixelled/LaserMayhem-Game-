$(function() {
	$('#bar1_img').hover(function() {
		$('#rect1').css('opacity', 0.5);
	}, function() {
		$('#rect1').css('opacity', 0);
	});

	$('#bar2_img').hover(function() {
		$('#rect2').css('opacity', 0.5);
	}, function() {
		$('#rect2').css('opacity', 0);
	});

	$('#bar3_img').hover(function() {
		$('#rect3').css('opacity', 0.5);
	}, function() {
		$('#rect3').css('opacity', 0);
	});

	$('#bar4_img').hover(function() {
		$('#rect4').css('opacity', 0.5);
	}, function() {
		$('#rect4').css('opacity', 0);
	});
});