function selectedSubject()
{
	var subject_id = $("#subject_id").children("option").filter(":selected").val();
	$("#categories").children().hide();
	$("#category_" + subject_id).show();
	$("#category_button_" + subject_id).show();
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
	if($(flashcard_answer_identifier).is(":visible")) {
		$(flashcard_answer_identifier).hide();
	} else {
		$(flashcard_answer_identifier).show();
	}
}
