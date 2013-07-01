/**first tier**/
$(document).ready(function() {
	showFirstFlashcard();
	showTopLevelTags();
});

function showNextFlashcard() {
	var selected_tags = getSelectedTags();
	var id = getRandomFlashcardId(selected_tags);
	showFlashcard(id);
}

function tagClicked() {
	
}

/**second tier**/

function showFirstFlashcard() {
	var id = getRandomFlashcardId(null);
	showFlashcard(id);
	$("#current_question_n").html("1");
	$("#total_questions_n").html(getTotalQuestions());
	var span = "<span class=\"tag flashcard_tag\">"
	$("#flashcard_tags").html(span + getFlashcardTagNames(id).join("</span>" + span) + "</span>");
}

function showTopLevelTags() {
	var top_level_tags = getChildTagNames('root');
}

function showChildrenTags() {
}

/**third tier**/
function showFlashcard(id) {
	$("#question").html(getQuestion(id));
	$("#answer").html(getAnswer(id));
	$("#source").html(getSource(id));
}
