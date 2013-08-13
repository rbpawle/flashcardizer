/**first tier**/
$(document).ready(function() {
	showNextFlashcard();
	showAvailableTags();
});

function showAnswerButtonPressed() {
	if($("#flashcard_answer").is(":visible")) {
		hideAnswerAndSource();
	}
	else {
		showAnswerAndSource();
	}
}

/**second tier**/

function showNextFlashcard() {
	var flashcard_id = getNextFlashcardId();
	showFlashcard(flashcard_id);
}

function hideAnswerAndSource() {
	$("#flashcard_answer").hide();
	$("#flashcard_source").hide();
}

function showAnswerAndSource() {
	$("#flashcard_answer").show();
	$("#flashcard_source").show();
}

function tagClickedOnFlashcardsTab(tag_id) {
	if(tagIsSelected(tag_id)) {
		setTagUnselected(tag_id);
	}
	else {
		if(atBottomTag()){
			setTagUnselected(getBottomTag());
		}
		setTagSelected(tag_id);
	}
	showSelectedTags();
	showAvailableTags();
	showNextFlashcard();
}
/**third tier**/
function showFlashcard(flashcard_id) {
	setFlashcardAsCurrent(flashcard_id);
	$("#question").html(getQuestion(flashcard_id));
	$("#answer").html(getAnswer(flashcard_id));
	$("#source").html(getSource(flashcard_id));
	updateQuestionNumbers(flashcard_id);
	showFlashcardTags(flashcard_id);
}

function showSelectedTags() {
	var selected_tag_ids = getSelectedTagIds();
	html_to_add = "";
	$.each(selected_tag_ids, function(index, tag_id) {
		html_to_add = html_to_add + "<span class=\"tag\" onclick=\"tagClicked(" + tag_id + ")\">" + getTagName(tag_id) + "</span>";
	});
	$("#selected_tags").html(html_to_add);
}

function showAvailableTags() {
	var tag_ids = getTagIdsUnderSelectedTags();
	html_to_add = "";
	$.each(tag_ids, function(index, tag_id) {
		html_to_add = html_to_add + "<div class=\"tag\" onclick=\"tagClicked(" + tag_id + ")\">" + getTagName(tag_id) + "</div>";
	});
	$("#available_tags").html(html_to_add);
}

/***fourth tier***/
function updateQuestionNumbers() {
	$("#current_question_n").html(getNumberOfSeenFlashcardsUnderCurrentTags());
	$("#total_questions_n").html(getNumberOfFlashcardsUnderCurrentTags());
}

function showFlashcardTags(flashcard_id) {
	var span = "<span class=\"tag flashcard_tag\">"
	$("#flashcard_tags").html(span + getFlashcardTagNames(flashcard_id).join("</span>" + span) + "</span>");
}
