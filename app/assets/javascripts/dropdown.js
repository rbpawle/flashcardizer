function selectedSubject()
{
	var subject_id = $("#subject_id").children("option").filter(":selected").val();
	$("#categories").children().hide();
	$("#category_" + subject_id).show();
	$("#category_button_" + subject_id).show();
}

function selectedCategory()
{
	subject_id = $("#subject_id").children("option").filter(":selected").val();
	category_id = $("#category_" + subject_id).children("option").filter(":selected").val();
	console.log(category_id);
	$("#flashcards").children().hide();
	$("#category_flashcards_" + category_id).show();
	$("#category_flashcards_" + category_id).children().hide();
	var dont_show = 0;
	$("#category_flashcards_" + category_id).each(function() {
		if($(this).is(":visible")) {
			dont_show = i;
		}
	});
}

function showAnswer(flashcard_answer_identifier)
{
	console.log(flashcard_answer_identifier);
	$(flashcard_answer_identifier).show();
}
