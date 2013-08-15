function send_create_request_ajax() {
	$('form').unbind('submit').submit(function() {
		var valuesToSubmit = $(this).serialize();
		$.ajax({
		    url: $(this).attr('action'), //sumbits it to the given url of the form
		    data: valuesToSubmit,
		    dataType: "JSON", // you want a difference between normal and ajax-calls, and json is standard
		    type: $(this).attr('method')
		}).done(function() {
			setNotice("Flashcard saved");
			resetUpdateFields();
		}).fail(function() {
			setNotice("Flashcard not saved, error");
		});
		return false; // prevents normal behaviour
	});
}

function resetUpdateFields() {
	$("#_new_flashcard_question").val("");
	$("#_new_flashcard_answer").val("");
	$("#_new_flashcard_source").val("");
}

function cleanUpHierarchies() {
	var n_hierarchies = getNumberOfHierarchies();
	for(var i = 0; i < n_hierarchies; i++) {
		var n_tags = $("#tag_hierarchy_" + i).children().length - 1;
		var all_blank = true;
		for(var j = 0; j < n_tags; j++) {
			if($("#_new_flashcard_tags_" + i + "_" + j).val() != "") {
				all_blank = false;
			} else if (j > 0) {
				if(tagFieldAndAllLowerTagFieldsEmpty("_new_flashcard_tags_" + i + "_" + j)) {
					removeAllLowerTagFields("_new_flashcard_tags_" + i + "_" + j)
					break;
				}
			}
		}
		if(all_blank && i > 0) {
			$("#tag_hierarchy_" + i).remove();
		}
	}
}

function getNumberOfHierarchies() {
	n_hierarchies = $(".tags_area").children().length - 1;
	return n_hierarchies;
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
		var id_of_element_to_add = "_new_flashcard_tags_" + hierarchy_n + "_" + (tag_n + 1);
		if($("#" + id_of_element_to_add).length == 0) {
			addTagField(hierarchy_n, tag_n + 1);
		}
	}
}

function addHierarchyButtonClicked() {
	n_hierarchies = getNumberOfHierarchies();
	tag_field_id = '_new_flashcard_tags_' + n_hierarchies + '_0';
	new_hierarchy_html = '<div id="tag_hierarchy_' + n_hierarchies + '"><div class="tag_hierarchy_prefix">HIERARCHY ' + (n_hierarchies + 1) + ':</div><input class="tag" id="' + tag_field_id + '" name="@new_flashcard[tags_' + n_hierarchies + '_0]" onkeyup="tagFieldKeyUp(' + n_hierarchies + ',0)" onblur="cleanUpHierarchies()" onfocus="setTagFieldCurrent(\'' + tag_field_id + '\')" size="30" type="text"></div>'
	$("#tags_field").append(new_hierarchy_html);
	setTagFieldCurrent('_new_flashcard_tags_' + n_hierarchies + '_0');
}

//*******second tier*********
function setTagFieldCurrent(tag_field_id) {
	$.each($("#tags_field").children(), function(i, child) {
		n_tags = $("#" + child.id).children().length - 1;
		for(var j = 0; j < n_tags; j++) {
			$("#_new_flashcard_tags_" + i + "_" + j).removeClass("current_tag_field");
		}
	});
	$("#" + tag_field_id).addClass("current_tag_field");
	hierarchy_n = tag_field_id.split("_")[tag_field_id.split("_").length - 2];
	hierarchy_id = "tag_hierarchy_" + hierarchy_n
	setTagHierarchyCurrent(hierarchy_id);
}

function setTagHierarchyCurrent(tag_hierarchy_id) {
	$.each($("#tags_field").children(), function(i, hierarchy) {
		$("#" + hierarchy.id).removeClass("current_tag_hierarchy");
	});
	$("#" + tag_hierarchy_id).addClass("current_tag_hierarchy");
}

function addTagField(hierarchy_n, new_tag_n) {
	var id_of_element_to_add = "_new_flashcard_tags_" + hierarchy_n + "_" + new_tag_n;
	var element_name = "@new_flashcard[tags_" + hierarchy_n + "_" + new_tag_n + "]";
	var onchange = "tagFieldKeyUp(" + hierarchy_n + "," + new_tag_n + ")";
	var onblur = '"cleanUpHierarchies()"';
	var onfocus = '"setTagFieldCurrent(\'' + id_of_element_to_add + '\')"';
	var input_html = '<input class="tag" id="' + id_of_element_to_add + '" name="' + element_name + '" onkeyup="' + onchange + '" onblur=' + onblur + ' onfocus=' + onfocus + 'size="30" type="text">';
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
