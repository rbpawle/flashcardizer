/**first tier**/
function topicDropdownChanged(dropdown_id) {
	populateTopicField(dropdown_id);
	showNextLevel(dropdown_id);
}

function updateTopicTextBoxChanged(level_n) {
	field_identifier = "#update_topic_field_" + level_n;
	next_field = "#update_topic_field_" + (parseInt(level_n) + 1);
	console.log(level_n);
	if($(next_field).length == 0) {
		createNextTopicBox(parseInt(level_n) + 1);
	}
}

/**second tier**/
function populateTopicField(dropdown_id) {
	identifier_split = dropdown_id.split("_");
	level_n = identifier_split[identifier_split.length - 1];
	topic = $("#" + dropdown_id).children("option").filter(":selected").html();
	$("#update_topic_field_" + level_n).val(topic);
}

function showNextLevel(dropdown_id) {
	showNextLevelSelect(dropdown_id);
	showNextLevelOptions(dropdown_id);
}

function createNextTopicBox(next_i) {
	$("#update_topics").append('Topic Level ' + next_i + ': <input id="update_topic_field_' + next_i + '" type="text" name="flashcard[topic_level_' + next_i + ']" oninput="updateTopicTextBoxChanged(' + next_i + ')" size="50"><br/>');
}

function resetUpdateFields() {
	$("#update_id_field").val("");
	var d=new Date();
	month = d.getMonth() + 1;
	$("#update_date_field").val(d.getFullYear() + "-" + month + "-" + d.getDate());
	for(i = 0; i < $("#update_topics").children().length; i++) {
		$("#update_topic_field_" + i).val("");
	}
	$("#update_question_field").val("");
	$("#update_answer_field").val("");
	$("#update_source_field").val("");
	for(i = 0; i < $("#update_importance_buttons").children().length; i++) {
		if(i == 2) {
			$("#radio_importance_" + i).checked = true;
			$("#radio_comprehension_" + i).checked = true;
		} else {
			$("#radio_importance_" + i).checked = false;
			$("#radio_comprehension_" + i).checked = false;
		}
	}
}

/**third tier**/
function showNextLevelSelect(dropdown_id) {
	next_level_identifier = nextLevelIdentifier(dropdown_id);
	$(next_level_identifier).show();
}

function showNextLevelOptions(dropdown_id) {
	next_level_identifier = nextLevelIdentifier(dropdown_id);
	this_parentid_topicid = $("#" + dropdown_id).find(":selected").val().split("_");
	this_topicid = this_parentid_topicid[1];
	for(var i = 0; i < $(next_level_identifier).children().length; i++) {
		next_parentid_topicid = $(next_level_identifier).children().eq(i).val().split("_");
		next_parentid = next_parentid_topicid[0];
		console.log(this_topicid);
		console.log(next_parentid);
		if(this_topicid == next_parentid) {
			$(next_level_identifier).children().eq(i).show();
		} else {
			$(next_level_identifier).children().eq(i).hide();
		}
	}
}

/**fourth tier**/
function nextLevelIdentifier(dropdown_id) {
	identifier_split = dropdown_id.split("_");
	next_level = parseInt(identifier_split[identifier_split.length - 1]) + 1;
	next_level_identifier = "#topic_update_dropdown_" + next_level;
	return next_level_identifier;
}
