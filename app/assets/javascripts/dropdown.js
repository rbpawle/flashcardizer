function selectedSubject(origin)
{
	switch(origin){
	case "show":
		var subject_id = $("#subject_id").children("option").filter(":selected").val();
		$("#categories").children().hide();
		$("#category_" + subject_id).show();
		$(".category_flashcards").hide();
		$("#category_button_" + subject_id).show();
		break;
	case "update":
		var subject_id = $("#subject_update_id").children("option").filter(":selected").val();
		$("#categories_update").children().hide();
		$("#category_update_" + subject_id).show();
		//for update form
		$("#flashcard_subject").val($("#subject_update_id").children("option").filter(":selected").html());
		break;
	}
}

function selectedCategory(origin) {
	var subject_id = $("#subject_update_id").children("option").filter(":selected").val();
	var category_id = $("#category_update_" + subject_id).children("option").filter(":selected").val();
	switch(origin){
	case "show":
		break; //nothing to do yet
	case "update":
		$("#flashcard_category").val($("#category_update_" + subject_id).children("option").filter(":selected").html());
		break;
	}
}

function displayQuestion()
{
	var subject_id = $("#subject_id").children("option").filter(":selected").val();
	var category_id = $("#category_" + subject_id).children("option").filter(":selected").val();
	var this_set = "#category_flashcards_" + category_id;
	var unseen_class = "unseen";
	n_unseen_cards = $(this_set).children("." + unseen_class).length;
	if(n_unseen_cards == 0) {
		$(this_set).children(".flashcard").addClass(unseen_class);
		n_unseen_cards = $(this_set).children("." + unseen_class).length;
	}
	var r = Math.floor(Math.random() * n_unseen_cards);
	card_to_show = $(this_set).children("." + unseen_class).eq(r);
	card_to_show.removeClass(unseen_class);
	//hide all category_flashcards, show this category_flashcards, hide all flashcards, show the card_to_show
	$(".category_flashcards").hide();
	$(this_set).show();
	$(".flashcard").hide();
	card_to_show.show();
}

function toggleAnswer(flashcard_answer_identifier)
{
	splited = flashcard_answer_identifier.split("_");
	flashcard_id = splited[splited.length - 1];
	edit_button_identifier = "#edit_flashcard_" + flashcard_id
	if($(flashcard_answer_identifier).is(":visible")) {
		$(flashcard_answer_identifier).hide();
		$(edit_button_identifier).hide();
	} else {
		$(flashcard_answer_identifier).show();
		$(edit_button_identifier).show();
	}
}

function editFlashcard(flashcard_id) {
	var subject_id = $("#subject_id").children("option").filter(":selected").val();
	$("#flashcard_id").val(flashcard_id);
	$("#flashcard_subject").val($("#subject_id").children("option").filter(":selected").html().replace(/&amp;/g, '&'));
	$("#flashcard_category").val($("#category_" + subject_id).children("option").filter(":selected").html().replace(/&amp;/g, '&'));
	$("#flashcard_question").val($("#flashcard_question_shown_" + flashcard_id).html().replace(/&amp;/g, '&'));
	$("#flashcard_answer").val($("#flashcard_answer_shown_" + flashcard_id).html().replace(/&amp;/g, '&'));
}

function send_create_request_ajax() { 
	$('form').submit(function() {
		var valuesToSubmit = $(this).serialize();
		console.log($(this));
		url_dest = $(this).attr('action').toString();
		$.post({
		    url: url_dest, //sumbits it to the given url of the form
		    data: valuesToSubmit,
		    dataType: "JSON", // you want a difference between normal and ajax-calls, and json is standard
		}).success(function(json){
			console.log("success");
		    //act on result.
		});
		return false; // prevents normal behaviour
	});
}
