/**first tier**/
$(document).ready(function() {
	id = getRandomFlashcardId(null);
	showFlashcard(id);
	$("#current_question_n").html("1");
	$("#total_questions_n").html(getTotalQuestions());
	$("#flashcard_tags").html("<span class=\"tag flashcard_tag\">" + getTags(id).join("</span><span class=\"tag flashcard_tag\">") + "</span>");
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

