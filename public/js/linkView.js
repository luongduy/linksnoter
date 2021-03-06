$(document).ready(function() {
	adjustCreatedTime();
	// prevent drowdown-menu from dissapearing when it is clicked 
	$('.dropdown-menu').click(function(e) {
    	e.stopPropagation();
	});
	// reset saveLinkFrom
	$(".dropdown-toggle").click(function(e){
        clearSaveLinkForm();
    });
	// adding click event to addTagButton
	$("#addTagButton").click(function (e) {
		addTag();
	});
	$("#tagTextbox").keypress(function (e) {
		if (e.which == 13) addTag();
	});
	// adding click event to the saveLinkButton
	$("#saveLinkButton").click(function(e) {
		saveLink();
	});
	$("#addTextbox").keypress(function(e) {
		if (e.which == 13) saveLink();
	});
	// increase view when user click on links
	$(".link").click(function(e) {
		increaseView(e.target);
	});
	// voteUp button
	$(".voteUp").click(function (e) {
		increaseVote(e.target);
	});
	// voteDown button
	$(".voteDown").click(function (e) {
		decreaseVote(e.target);
	});
	// delete link
	$(".deleteLink").click(function (e) {
		deleteLink(e.target);
	});
	// search button
	$("#searchButton").click(function (e) {
		doSearch(e.target);
	});
	$("#searchTextbox").keypress(function (e) {
		if (e.which == 13) doSearch(e);
	});

});

function addTag() {
	var tags = $("#tags").val();
	var newTag = $("#tagTextbox").val();
	if (newTag != "") {
		tags = tags + newTag + ",";
		var tagLabel = $("<label> </label>").attr("class", "label label-info tagLabel").text(newTag);
		$("#labelDiv").append(tagLabel);
	}
	$("#tags").val(tags);
	$("#tagTextbox").focus().val("");
}

function clearSaveLinkForm() {
	$("#addTextbox").val("");
	$("#tagTextbox").val("");
	$("#tags").val("");
	$("#labelDiv").empty();
	$("#addTextbox").focus();
}

function saveLink() {
	// submit the form
	var url = $("#addTextbox").val();
	if (validateURL(url)) {
		$("#saveLinkForm").submit();	
	} else {
		$("#addTextbox").focus();
		$("#addTextbox").notify("Invalid URL", {
				position: "top left",
				className: "error"
			});
	}
}

function increaseView(e) {
	var linkId = $(e).parent().find('label').attr('id');
	location.href = '/links/' + linkId;
}

function increaseVote(e) {
	var invalid = $(e).parents('.col-sm-1').find('.glyphicon-chevron-up').hasClass('voted');
	if (!invalid) {
		var linkId = $(e).parents('.row').find('.numberOfViewLabel').attr('id');
		// token
		$.ajaxSetup({
	        headers: {
	            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
	        }
	    })
		$.ajax({
	        url: '/links/increaseVote/'+ linkId,
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
	        },
	       
	        error: function(xhr, textStatus, e) {
	        	if (xhr.status === 401){
	        		$.notify("Please login!", {
						position: "bottom center",
						className: "success"
					});
					location.href = '/login';
	        	}
	        }

	    });
	}
	$(':focus').blur();
}

function decreaseVote(e) {
	var invalid = $(e).parents('.col-sm-1').find('.glyphicon-chevron-down').hasClass('voted');
	if (!invalid) {
		var linkId = $(e).parents('.row').find('.numberOfViewLabel').attr('id');
		// token
		$.ajaxSetup({
	        headers: {
	            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
	        }
	    })
		LinkNoter.ajax({
	        url: '/links/decreaseVote/'+ linkId,
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
				$(':focus').blur();
	        },
	        error: function(xhr, textStatus, e) {
	        	if (xhr.status === 401){
	        		$.notify("Please login!", {
						position: "bottom center",
						className: "success"
					});
					location.href = '/login';
	        	}
	        }
	    });
	}
	$(':focus').blur();
}

function doSearch(e) {
	var searchText = $("#searchTextbox").val();
	if ("" != searchText){
		$("#searchForm").submit();	
	}
}

function deleteLink(e) {
	var linkId = $(e).parents('.row').find('.numberOfViewLabel').attr('id');
	// token
	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    })
	LinkNoter.ajax({
        url: '/links/deleteLink/'+ linkId,
        method: 'POST',
        data: '',
        success: function (res) {
            location.href = '/links';
        }
    });
}

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

function validateURL(textval) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}
