/**first tier**/
function showSubtopicsAndFlashcardForTopic(topic_attr_id, topic_id, topic_level_n) {
	highlightTopic(topic_attr_id, topic_level_n);
	showSubtopics(topic_id, topic_level_n);
	showFirstFlashcard(topic_id);
	updateTotalQuestionsNumber();
	updateQuestionSequenceNumber();
}

function showNextFlashcard() {
	showFlashcardAmongSelected();
	updateQuestionSequenceNumber();
	$("#edit_flashcard").hide();
}

function showAnswerAndSource() {
	curid_split = $(".currently_shown").attr('id').split("_");
	flashcard_id = curid_split[1];
	$("#answer_shown_"	+ flashcard_id).show();
	$("#source_shown_"	+ flashcard_id).show();
	$("#edit_flashcard").show();
}

function editFlashcard() {
	identifier = $(".currently_shown").attr('id');
	idsplit = identifier.split("_");
	flashcard_id = idsplit[1];
	topics = $(".currently_shown").children(".topics_description").html().split(" &gt; ");
	question = $(".currently_shown").children(".question_area").children(".question").html();
	answer = $(".currently_shown").children(".answer_area").children(".answer").html();
	source_ = $(".currently_shown").children(".source_area").children(".source").html();
	$("#update_id_field").val(flashcard_id);
	for(var i = 0; i < topics.length; i++) {
		$("#update_topic_field_" + i).val(topics[i]);
	}
	$("#update_question_field").val(question);
	$("#update_answer_field").val(answer);
	$("#update_source_field").val(source_);
	showTab("#update_tab");
}

/**second tier**/
function highlightTopic(topic_attr_id, topic_level_n) {
	var topic_level = "#topic_level_" + topic_level_n.toString();
	$(topic_level).children().css("background-color","#0b5fa5");
	$(topic_attr_id).css("background-color","#3aa6d0");
}
	
function showSubtopics(parent_id, parent_level_n) {
	var subtopic_level = "#topic_level_" + (parent_level_n + 1).toString();
	all_subtopics = $(subtopic_level).children();
	all_subtopics.hide();
	for(var i = 0; i < all_subtopics.length; i++) {
		subtopic = all_subtopics.eq(i);
		id_split = subtopic.attr('id').split("_");
		subtopic_parent_id = id_split[2];
		if(subtopic_parent_id == parent_id) {
			subtopic.show();
		}
	}
}

function showFirstFlashcard(topic_id) {
	selectFlashcardsUnderTopic(topic_id);
	showFlashcardAmongSelected(topic_id);
}

function updateTotalQuestionsNumber() {
	total_selected = $(".under_selected_topic").length;
	$("#total_questions_n").html(total_selected);
}

function updateQuestionSequenceNumber() {
	unseen_n = getTotalUnseenUnderSelectedTopic();
	seen_n = $(".under_selected_topic").length - unseen_n;
	$("#current_question_n").html(seen_n);
}

/**third tier**/

function selectFlashcardsUnderTopic(topic_id) {
	flashcards = $("#flashcards").children();
	flashcards.removeClass("under_selected_topic");
	$(".topic_" + topic_id).addClass("under_selected_topic");
}

function showFlashcardAmongSelected() {
	$(".flashcard").hide(); //hide all flashcards
	flashcard_to_show = pickRandomUnseenFlashcardAmongSelected();
	$(".currently_shown").removeClass("currently_shown"); //remove all currently_shown
	flashcard_to_show.removeClass("unseen");
	flashcard_to_show.addClass("currently_shown");
	flashcard_to_show.show();
	hideAnswerAndSource(getFlashcardIdFromFlashcardElement(flashcard_to_show));
}

function getTotalUnseenUnderSelectedTopic() {
	unseen_n = 0;
	under_selected_topic_n = $(".under_selected_topic").length
	for(i = 0; i < under_selected_topic_n; i++) {
		if($(".under_selected_topic").eq(i).hasClass("unseen")) {
			unseen_n++;
		}
	}
	return unseen_n;
}

/**fourth tier**/

function getFlashcardIdFromFlashcardElement(flashcard) {	
	fsplit = flashcard.attr('id').split("_");
	return fsplit[1];
}

function pickRandomUnseenFlashcardAmongSelected() {
	total_selected = $(".under_selected_topic").length;
	if(total_selected == 1) {
		flashcard_to_show = $(".under_selected_topic").eq(0);
	} else { //if none are unseen, make all unseen
		all_have_been_seen = true;
		for(i=0;i<total_selected;i++){
			if($(".under_selected_topic").eq(i).hasClass("unseen")) {
				all_have_been_seen = false;
			}
		}
		if(all_have_been_seen) {
			$(".under_selected_topic").addClass("unseen");
		}
		do { //keep picking random flashcards for this topic until we find one that hasn't been seen or that isn't currently shown
			flashcard_to_show = $(".under_selected_topic").eq(Math.floor(Math.random() * total_selected));
		} while(flashcardSeenOrCurrentlyShown(flashcard_to_show));
	}
	return flashcard_to_show;
}

function hideAnswerAndSource(flashcard_id) {
	$("#answer_shown_"	+ flashcard_id).hide();
	$("#source_shown_"	+ flashcard_id).hide();
}

/**fifth tier**/
function flashcardSeenOrCurrentlyShown(flashcard) {
	if((!flashcard.hasClass("unseen")) || flashcard.hasClass("currently_shown")) {
		return true;
	} else {
		return false;
	}
}
