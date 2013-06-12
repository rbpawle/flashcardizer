/**first tier**/
function topicDropdownChanged(dropdown_id) {
	populateTopicField(dropdown_id);
	showNextLevel(dropdown_id);
}

function updateTopicTextBoxChanged(level_n) {
	field_identifier = "#topic_update_field_" + level_n;
	next_field = "#topic_update_field_" + (parseInt(level_n) + 1);
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
	$("#topic_update_field_" + level_n).val(topic);
}

function showNextLevel(dropdown_id) {
	showNextLevelSelect(dropdown_id);
	showNextLevelOptions(dropdown_id);
}

function createNextTopicBox(next_i) {
	$("#update_topics").append('Topic ' + next_i + ': <input id="topic_update_field_' + next_i + '" type="text" name="flashcard[topic_level_' + next_i + ']" oninput="updateTopicTextBoxChanged(' + next_i + ')" size="50"><br/>');
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
