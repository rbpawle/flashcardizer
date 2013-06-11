function showSubtopicsAndSelectFlashcards(parent_id, parent_level_n) {
	showSubTopics(parent_id, parent_level_n);
	selectFlashcards(parent_id);
	showRandomFlashcardFromThoseSelected();
}

function showSubTopics(parent_id, parent_level_n) {
	var subtopic_level = "#topic_level_" + (parent_level_n + 1).toString();
	$(subtopic_level).children().hide();
	all_subtopics = $(subtopic_level).children();
	for(var i = 0; i < all_subtopics.length; i++) {
		subtopic = all_subtopics.eq(i);
		id_split = subtopic.attr('id').split("_");
		subtopic_parent_id = id_split[2];
		if(subtopic_parent_id == parent_id) {
			subtopic.show();
		}
	}
}

function selectFlashcards(topic_id) {
	$("#flashcards").children().hide();
	all_flashcards = $("#flashcards").children();
	for(var i = 0; i < all_flashcards.length; i++) {
		flashcard_id = getFlashcardIdFromFlashcardElement(all_flashcards.eq(i));
		topics = $("#flashcard_topics_" + flashcard_id).html().split(",");
		for(var j = 0; j < topics.length; j++) {
			if(topics[j] == topic_id) {	
				all_flashcards.eq(i).show();
			}
		}
	}
}

function getFlashcardIdFromFlashcardElement(flashcard) {	
	fsplit = flashcard.attr('id').split("_");
	return fsplit[1];
}

function showRandomFlashcardFromThoseSelected() {
	candidates = $("#flashcards").find(".flashcard:visible");
	//among unseen flashcards in this round, pick one at random that hasn't been seen.
	//also make sure we don't show the last-seen card this time.
	var last_seen_class = "last_seen";
	var last_seen_card = $("#flashcards").children("." + last_seen_class);
	if (last_seen_card.length == 0) {
		var last_seen_card_id = -1;
	}else {
		//make sure the answer is hidden
		var last_seen_card_id = last_seen_card.attr('id');
		split_last_card = last_seen_card_id.split("_");
		flashcard_id = split_last_card[split_last_card.length - 1];
		hideAnswer(flashcard_id);
		candidates.removeClass(last_seen_class);
	}
	var unseen_class = "unseen";
	var n_unseen_cards = $("#flashcards").children("." + unseen_class).length;
	if(n_unseen_cards == 0) { //if none unseen, make all unseen
		candidates.addClass(unseen_class);
		n_unseen_cards = $(this_set).children("." + unseen_class).length;
	}
	do {
		var r = Math.floor(Math.random() * n_unseen_cards);
		card_to_show = $(this_set).children("." + unseen_class).eq(r);
	} while(card_to_show.attr('id') == last_seen_card_id);
	card_to_show.removeClass(unseen_class);
	var total_questions = parseInt($("#total_questions_n").html());
	if(total_questions > 1) {//we don't want to add last_seen if there is only one question, that gives us an infinite loop
		card_to_show.addClass(last_seen_class);
	}
	//update question number
	var last_question_n = parseInt($("#current_question_n").html());
	var next_question_n = (last_question_n % total_questions) + 1;
	$("#current_question_n").html(next_question_n);
	$(".flashcard").hide();
	card_to_show.show();
}

function hideAnswer(flashcard_id) {
	$("#answer_shown_"	+ flashcard_id).hide();
	$("#source_shown_"	+ flashcard_id).hide();
	//$("#update_flashcard_"				+ flashcard_id).hide();
	//$("#show_answer_"							+ flashcard_id).show();
}
