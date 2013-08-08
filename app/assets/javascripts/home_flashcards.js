/**first tier**/
$(document).ready(function() {
	showNextFlashcard();
	showAllTags();
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

function showAllTags() {
	$("#tags").show();
	showAssociatedTags([]);
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
		setTagSelected(tag_id);
	}
	var selected_tag_ids = getSelectedTagIds();
	showSelectedTags(selected_tag_ids);
	showAssociatedTags();
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

function showSelectedTags(selected_tag_ids) {
	html_to_add = "";
	$.each(selected_tag_ids, function(index, tag_id) {
		html_to_add = html_to_add + "<span class=\"tag\" onclick=\"tagClicked(" + tag_id + ")\">" + getTagName(tag_id) + "</span>";
	});
	$("#selected_tags").html(html_to_add);
}

function showAssociatedTags(selected_tag_ids) {
	var associated_tag_ids = getNTagsToShow(20);
	html_to_add = "";
	$.each(associated_tag_ids, function(index, tag_id) {
		if(tagIsSelected(tag_id) == false) { //if this tag id is not selected
			html_to_add = html_to_add + "<div class=\"tag\" onclick=\"tagClicked(" + tag_id + ")\" style=\"font-size:" + getTagFont(tag_id) + "%\">" + getTagName(tag_id) + "</div>";
		}
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
