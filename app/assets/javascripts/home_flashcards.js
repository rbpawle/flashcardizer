/**first tier**/
$(document).ready(function() {
	/**for first flashcard**/
	id = getRandomFlashcardId(null);
	showFlashcard(id);
	$("#current_question_n").html("1");
	$("#total_questions_n").html(getTotalQuestions());
	var span = "<span class=\"tag flashcard_tag\">"
	$("#flashcard_tags").html(span + getFlashcardTags(id).join("</span>" + span) + "</span>");
	/**for tags area**/
	var span = "<span class=\"tag available_tags\">"
	$("#tags").html(span + getAllTags().join("</span>" + span) + "</span>");
});

function showNextFlashcard() {
	selected_tags = getSelectedTags();
	id = getRandomFlashcardId(selected_tags);
	showFlashcard(id);
}

/**second tier**/
function showFlashcard(id) {
	$("#question").html(getQuestion(id));
	$("#answer").html(getAnswer(id));
	$("#source").html(getSource(id));
}

