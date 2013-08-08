function send_create_request_ajax() {
	$('form').unbind('submit').submit(function() {
		var valuesToSubmit = $(this).serialize();
		$.ajax({
		    url: $(this).attr('action'), //sumbits it to the given url of the form
		    data: valuesToSubmit,
		    dataType: "JSON", // you want a difference between normal and ajax-calls, and json is standard
		    type: $(this).attr('method')
		});
		$("#update_question_field").val("");
		$("#update_answer_field").val("");
		return false; // prevents normal behaviour
	});
}

function resetUpdateFields() {
	
}

function tagClickedOnUpdateTab(tag_id) {
	if(tagIsSelected(tag_id)) {
		setTagUnselected(tag_id);
	}
	else {
		setTagSelected(tag_id);
	}
	updateFormWithSelectedTags();
	var selected_tag_ids = getSelectedTagIds();
	showSelectedTags(selected_tag_ids);
	showAssociatedTags();
}

function updateFormWithSelectedTags() {
	$("#_new_flashcard_tags").val('');
	selected_tag_ids = getSelectedTagIds();
	if(selected_tag_ids.length > 0) {
		$("#_new_flashcard_tags").val(getTagName(selected_tag_ids[0]));
		for(var i = 1; i < selected_tag_ids.length; i++) {
			existing = $("#_new_flashcard_tags").val();
			$("#_new_flashcard_tags").val(existing + "||" + getTagName(selected_tag_ids[i]));
		}
	}
}
