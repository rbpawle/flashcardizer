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
	if(tagIsSelected(tag_id)) { //de-select all tags below the clicked tag
		setTagsBelowTagUnselected(tag_id)
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
	updateFormWithSelectedTags();
}

function tagFieldKeyUp(hierarchy_n, tag_n) {
	var current_tag_field_id = "_new_flashcard_tags_" + hierarchy_n + "_" + tag_n;
	if(tagFieldAndAllLowerTagFieldsEmpty(current_tag_field_id) && tag_n > 0) {
		removeAllLowerTagFields(current_tag_field_id);
	} else {
		var current_tag_hierarchy_id = "tag_hierarchy_" + hierarchy_n;
		setTagFieldCurrent(current_tag_field_id);
		setTagHierarchyCurrent(current_tag_hierarchy_id);
		var id_of_element_to_add = "_new_flashcard_tags_" + hierarchy_n + "_" + (tag_n + 1);
		if($("#" + id_of_element_to_add).length == 0) {
			addTagField(hierarchy_n, tag_n + 1);
		}
	}
}

function addHierarchyButtonClicked() {
	n_hierarchies = $(".tags_area").children().length / 2;
	console.log(n_hierarchies);
	new_hierarchy_html = '<div class="tag_hierarchy_prefix">HIERARCHY ' + (n_hierarchies + 1) + ':</div><div id="tag_hierarchy_' + n_hierarchies + '"><input class="tag" id="_new_flashcard_tags_' + n_hierarchies + '_0" name="@new_flashcard[tags_' + n_hierarchies + '_0]" onkeyup="tagFieldKeyUp(' + n_hierarchies + ',0)" size="30" type="text"></div>'
	$(".tags_area").append(new_hierarchy_html);
	
	setTagFieldCurrent('_new_flashcard_tags_' + n_hierarchies + '_0');
	setTagHierarchyCurrent('tag_hierarchy_' + n_hierarchies);
}

//*******second tier*********
function setTagFieldCurrent(tag_field_id) {
	$.each($("#tags_field").children(), function(i, child) { 
		$("#" + child.id).removeClass("current_tag_field");
	});
	$("#" + tag_field_id).addClass("current_tag_field");
}

function setTagHierarchyCurrent(tag_hierarchy_id) {
	$.each($("#tags_field"), function(i, hierarchy) {
		$("#" + hierarchy.id).removeClass("current_tag_hierarchy");
	});
	$("#" + tag_hierarchy_id).addClass("current_tag_hierarchy");
}

function addTagField(hierarchy_n, new_tag_n) {
	var id_of_element_to_add = "_new_flashcard_tags_" + hierarchy_n + "_" + new_tag_n;
	var element_name = "@new_flashcard[tags_" + hierarchy_n + "_" + new_tag_n + "]";
	var onchange = "tagFieldKeyUp(" + hierarchy_n + "," + new_tag_n + ")";
	var input_html = '<input class="tag" id="' + id_of_element_to_add + '" name="' + element_name + '" onkeyup="' + onchange + '" size="30" type="text">';
	var tag_hierarchy = "tag_hierarchy_" + hierarchy_n;
	$("#" + tag_hierarchy).append(input_html);
}

function tagFieldAndAllLowerTagFieldsEmpty(tag_field_id) {
	all_empty = true;
	tag_n = parseInt(tag_field_id.split("_")[tag_field_id.split("_").length - 1]);
	tag_hierarchy_id = $("#" + tag_field_id).parent()[0].id
	$.each($("#" + tag_hierarchy_id).children(), function(i, tag) {
		if(i >= tag_n && $("#" + tag.id).val() != "") {
			all_empty = false;
		}
	});
	return all_empty;
}

function removeAllLowerTagFields(tag_field_id) {
	tag_n = parseInt(tag_field_id.split("_")[tag_field_id.split("_").length - 1]);
	tag_hierarchy_id = $("#" + tag_field_id).parent()[0].id
	$.each($("#" + tag_hierarchy_id).children(), function(i, tag) {
		if(i > tag_n) {
			$("#" + tag.id).remove();
		}
	});
}

function updateFormWithSelectedTags() {
	tag_ids = getSelectedTagIds();
	current_tag_hierarchy = $(".current_tag_hierarchy");
	current_tag_hierarchy_n = $(".current_tag_hierarchy")[0].id.split("_")[$(".current_tag_hierarchy")[0].id.split("_").length - 1];
	$.each(current_tag_hierarchy.children(), function(i, child) {
		$("#" + child.id).remove();
	});
	$.each(tag_ids, function(i, tag_id) {
		addTagField(current_tag_hierarchy_n, i)
		$("#_new_flashcard_tags_" + current_tag_hierarchy_n + "_" + i).val(getTagName(tag_id));
	});
	addTagField(current_tag_hierarchy_n, tag_ids.length + 1);
}
