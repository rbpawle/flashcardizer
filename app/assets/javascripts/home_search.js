
$(function() {
	$("#search_bar").keyup(function(event) {
		if(event.keyCode == 13) {
			searchButtonClicked();
		}
	});
});

function searchButtonClicked() {
	var starttime = microtime(true);
	$("#search_results").html("");
	query_string = $("#search_bar").val().toLowerCase();
	nothing_found = true;
	if(query_string.length > 3) {
		for(i = 0; i < $("#flashcards").children().length; i++) {
			found_in_question = $("#flashcards").children().eq(i).children(".question_area").children(".question").text().toLowerCase().match(query_string);
			found_in_answer = $("#flashcards").children().eq(i).children(".answer_area").children(".answer").text().toLowerCase().match(query_string);
			if(found_in_question || found_in_answer) {
				nothing_found = false;
				$("#search_results").append($("#flashcards").children().eq(i).html().replace("display:none","") + "<br/>");
			}
		}
		if(nothing_found) {
			$("#search_results").append("No matches among questions or answers.");
		}
	} else {
		$("#search_results").append("Search string needs to be 4 characters or more.");
	}
	var endtime = microtime(true);
}

function microtime(get_as_float) {
	var unixtime_ms = new Date().getTime();
	var sec = parseInt(unixtime_ms / 1000);
	return get_as_float ? (unixtime_ms/1000) : (unixtime_ms - (sec * 1000))/1000 + ' ' + sec;
}

