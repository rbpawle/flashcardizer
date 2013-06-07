function selectedSubject(origin)
{
	switch(origin){
	case "show":
		var subject_id = $("#subject_id").children("option").filter(":selected").val();
		$("#categories").children().hide();
		$("#category_" + subject_id).show();
		$(".category_flashcards").hide();
		break;
	case "update":
		var subject_id = $("#subject_update_id").children("option").filter(":selected").val();
		$(".update_category_dropdown").hide();
		$("#category_update_" + subject_id).show();
		//for update form
		$("#flashcard_subject").val($("#subject_update_id").children("option").filter(":selected").html());
		break;
	}
}

function selectedCategory(origin) {
	switch(origin){
	case "show":
		var subject_id = $("#subject_id").children("option").filter(":selected").val();
		console.log("#next_question_button");
		$("#next_question_button").show();
		displayQuestion();
		break;
	case "update":
		var category_id = $("#category_update_" + subject_id).children("option").filter(":selected").val();
		var subject_id = $("#subject_update_id").children("option").filter(":selected").val();
		$("#flashcard_category").val($("#category_update_" + subject_id).children("option").filter(":selected").html());
		break;
	}
}

function selectedDate() {
	var date = $("#the_date_dropdown").children("option").filter(":selected").val();
	console.log("trying to click #date_" + date);
	$(document).ready(function(){
		$("#date_" + date).trigger('click');
	});
}

function displayQuestion()
{
	var subject_id = $("#subject_id").children("option").filter(":selected").val();
	var category_id = $("#category_" + subject_id).children("option").filter(":selected").val();
	var this_set = "#category_flashcards_" + category_id;
	//among unseen flashcards in this round, pick one at random that hasn't been seen.
	//also make sure we don't show the last-seen card this time.
	var last_seen_class = "last_seen";
	var last_seen_card = $(this_set).children("." + last_seen_class);
	if (last_seen_card.length == 0) {
		var last_seen_card_id = -1;
	}else {
		//make sure the answer is hidden
		var last_seen_card_id = last_seen_card.attr('id');
		split_last_card = last_seen_card_id.split("_");
		flashcard_id = split_last_card[split_last_card.length - 1];
		hideAnswer(flashcard_id);
		$(this_set).children().removeClass(last_seen_class);
	}
	var unseen_class = "unseen";
	var n_unseen_cards = $(this_set).children("." + unseen_class).length;
	if(n_unseen_cards == 0) { //if none unseen, make all unseen
		$(this_set).children(".flashcard").addClass(unseen_class);
		n_unseen_cards = $(this_set).children("." + unseen_class).length;
	}
	do {
		var r = Math.floor(Math.random() * n_unseen_cards);
		card_to_show = $(this_set).children("." + unseen_class).eq(r);
	} while(card_to_show.attr('id') == last_seen_card_id);
	card_to_show.removeClass(unseen_class);
	var total_questions = parseInt($("#total_questions_for_" + category_id).html());
	if(total_questions > 1) {//we don't want to add last_seen if there is only one question, that gives us an infinite loop
		card_to_show.addClass(last_seen_class);
	}
	//update question number
	var last_question_n = parseInt($("#current_question_number_" + category_id).html());
	var next_question_n = (last_question_n % total_questions) + 1;
	$("#current_question_number_" + category_id).html(next_question_n);
	//hide all category_flashcards, show this category_flashcards, hide all flashcards, show the card_to_show
	$(".category_flashcards").hide();
	$(this_set).show();
	$(".flashcard").hide();
	card_to_show.show();
}

function toggleAnswer(flashcard_id)
{
	var answer_identifier = "#flashcard_answer_shown_"	+ flashcard_id;
	if($(answer_identifier).is(":visible")) {
		hideAnswer(flashcard_id);
	} else {
		showAnswer(flashcard_id);
	}
}

function hideAnswer(flashcard_id) {
	$("#flashcard_answer_shown_"	+ flashcard_id).hide();
	$("#update_flashcard_"				+ flashcard_id).hide();
	$("#flashcard_source_shown_"	+ flashcard_id).hide();
	$("#show_answer_"							+ flashcard_id).show();
}

function showAnswer(flashcard_id) {
	$("#flashcard_answer_shown_"	+ flashcard_id).show();
	$("#update_flashcard_"				+ flashcard_id).show();
	$("#flashcard_source_shown_"	+ flashcard_id).show();
	$("#show_answer_"							+ flashcard_id).hide();
}

function editFlashcard(flashcard_id) {
	var subject_id = $("#subject_id").children("option").filter(":selected").val();
	$("#flashcard_id").val(flashcard_id);
	$("#flashcard_subject").val($("#subject_id").children("option").filter(":selected").html().replace(/&amp;/g, '&'));
	$("#flashcard_category").val($("#category_" + subject_id).children("option").filter(":selected").html().replace(/&amp;/g, '&'));
	$("#flashcard_question").val($("#flashcard_question_text_" + flashcard_id).html().replace(/&amp;/g, '&'));
	$("#flashcard_answer").val($("#flashcard_answer_text_" + flashcard_id).html().replace(/&amp;/g, '&'));
	$("#flashcard_source").val($("#flashcard_source_text_" + flashcard_id).html().replace(/&amp;/g, '&'));
	showTab("#update_tab");
}

function send_create_request_ajax() {
	$('form').unbind('submit').submit(function() {
		var valuesToSubmit = $(this).serialize();
		$.ajax({
		    url: $(this).attr('action'), //sumbits it to the given url of the form
		    data: valuesToSubmit,
		    dataType: "JSON", // you want a difference between normal and ajax-calls, and json is standard
		    type: $(this).attr('method')
		});
		$("#flashcard_question").val("");
		$("#flashcard_answer").val("");
		return false; // prevents normal behaviour
	});
}

function showTab(tab) {
	$("#tabs").children().hide();
	$(tab).show();
}

function dropDownDates() {
	if($("#the_date_dropdown").is(":visible")) {
		$("#the_date_dropdown").hide();
	} else {
		$("#the_date_dropdown").show();
	}
}
