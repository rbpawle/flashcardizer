function searchBarKeyUp() {
	$("#search_bar").keyup(function(event){
    if(event.keyCode == 13){
        $("#search_button").click();
    }
	});
}

function searchButtonClicked() {
	$("#search_results").html("");
	query_string = $("#search_bar").val().toLowerCase();
	if(query_string.length > 3) {
		for(i = 0; i < $("#flashcards").children().length; i++) {
			found_in_question = $("#flashcards").children().eq(i).children(".question_area").children(".question").text().toLowerCase().match(query_string);
			found_in_answer = $("#flashcards").children().eq(i).children(".answer_area").children(".answer").text().toLowerCase().match(query_string);
			if(found_in_question || found_in_answer) {
				$("#search_results").append($("#flashcards").children().eq(i).html().replace("display:none","") + "<br/>");
			}
		}
	} else {
		$("#search_results").append("Search string needs to be 4 characters or more.");
	}
}
