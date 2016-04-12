$(document).ready(function() {
	adjustCreatedTime();
	// voteUp button
	$(".voteUp").click(function (e) {
		increaseVote(e.target, 'link');
	});
	// voteDown button
	$(".voteDown").click(function (e) {
		decreaseVote(e.target, 'link');
	});
	// comment voteUp button
	$(".comment-voteUp").click(function (e) {
		increaseVote(e.target, 'comment');
	});
	// comment voteDown button
	$(".comment-voteDown").click(function (e) {
		decreaseVote(e.target, 'comment');
	});
	$(".link").click(function(e) {
		increaseView(e.target);
	});
});

function adjustCreatedTime() {
	$(".createdAtSpan").each(function () {
		var timeDiff = convertDateToUTC(new Date()) - new Date($(this).text());
		var noOfDays = Math.trunc(timeDiff/(1000*60*60*24));
		var noOfHours = Math.trunc(timeDiff % (1000*60*60*24) / (1000*60*60));
		var noOfMins = Math.trunc(timeDiff % (1000*60*60*24) % (1000*60*60) / (1000*60));
		if (noOfDays > 1) $(this).text(noOfDays + " days ago");
		else if (noOfDays > 0) $(this).text(noOfDays + " day ago");
		else if (noOfHours > 1) $(this).text(noOfHours + " hours ago");
		else if (noOfHours > 0) $(this).text(noOfHours + " hour ago");
		else if (noOfMins > 1) $(this).text(noOfMins + " minutes ago");
		else $(this).text(noOfMins + " minute ago");
	})
}

function increaseView(e) {
	var linkId = $(e).parent().find('label').attr('id');
	// token
	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    })
	LinkNoter.ajax({
        url: '/links/increaseView/'+ linkId,
        method: 'POST',
        data: '',
        success: function (res) {
            location.href = '/links/' + linkId + '/comments';
        }
    });
}

function increaseVote(e, type) {
	var invalid = $(e).parents('.col-sm-1').find('.glyphicon-chevron-up').hasClass('voted');
	if (!invalid) {
		var linkId = $('.link-id').attr('id');
		var noteId = $(e).parents('.row').find('.comment-id').attr('id');
		if (type === 'link') 
			url = '/links/increaseVote/' + linkId;
		else url = '/links/' + linkId + '/comments/' + noteId + '/increaseVote';
		// token
		$.ajaxSetup({
	        headers: {
	            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
	        }
	    })
		LinkNoter.ajax({
	        url: url,
	        method: 'POST',
	        async: false,
	        data: '',
	        success: function (res) {
	        	if ($(e).parents('.col-sm-1').find('.glyphicon-chevron-down').hasClass('voted')){
	        		$(e).parents('.col-sm-1').find('.glyphicon-chevron-down').removeClass('voted');
	        	}else $(e).parent().find('.glyphicon-chevron-up').addClass('voted');
	        	var voteLabel = $(e).parents('.col-sm-1').find('label');
	        	var voteNo = voteLabel.text();
	        	voteLabel.text(++voteNo);
	            $.notify("Thank you very much for your feedback!", {
					position: "bottom center",
					className: "success"
				});
	        }
	    });
	    return true;
	}
    return false;
}

function decreaseVote(e, type) {
	var invalid = $(e).parents('.col-sm-1').find('.glyphicon-chevron-down').hasClass('voted');
	if (!invalid) {
		var linkId = $('.link-id').attr('id');
		var noteId = $(e).parents('.row').find('.comment-id').attr('id');
		if (type === 'link') 
			url = '/links/decreaseVote/' + linkId;
		else url = '/links/' + linkId + '/comments/' + noteId + '/decreaseVote';
		// token
		$.ajaxSetup({
	        headers: {
	            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
	        }
	    })
		LinkNoter.ajax({
	        url: url,
	        method: 'POST',
	        async: false,
	        data: '',
	        success: function (res) {
	        	if ($(e).parents('.col-sm-1').find('.glyphicon-chevron-up').hasClass('voted')){
	        		$(e).parents('.col-sm-1').find('.glyphicon-chevron-up').removeClass('voted');
	        	}else {
	        		$(e).parent().find('.glyphicon-chevron-down').addClass('voted');

	        	}
	        	var voteLabel = $(e).parents('.col-sm-1').find('label');
	        	var voteNo = voteLabel.text();
	        	voteLabel.text(--voteNo);
	            $.notify("Thank you very much for your feedback!", {
					position: "bottom center",
					className: "success"
				});
	        }
	    });
	    return true;
	}
    return false;
}