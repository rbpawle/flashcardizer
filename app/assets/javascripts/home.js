function navBarClicked(tab) {
	resetUpdateFields();
	hideAnswerAndSource();
	showTab(tab);
}

function showTab(tab) {
	$("#tabs").children().hide();
	$(tab).show();
	switch(tab) {
	case "#update_tab":
		showAllTags();
		break;
	case "#flashcards_tab":
		showAllTags();
		break;
	}
}

function tagClicked(tag_id) {
	switch(getCurrentTabId()) {
	case "flashcards_tab":
		tagClickedOnFlashcardsTab(tag_id);
		break;
	case "update_tab":
		tagClickedOnUpdateTab(tag_id);
		break;
	}
}

function getCurrentTabId() {
	id = '';
	$.each($("#tabs").children(), function(i,div) {
		if($(div).is(":visible") && $(div).hasClass('tab')) {
			id = $(div).attr('id')
		}
	});
	return id;
}

//json interface for flashcards and tags
(function(window){
	//flashcard keys:
	//q: question
	//a: answer
	//s: source
	//d: date
	//t: tag id list
	//u: unseen
	//c: currently shown
	//l: last seen
	
	//tag keys:
	//n: name
	//f: flashcard ids
	//s: selected
	//a: associated tags
	
	//returns the intersection of arrays a and b
	function _intersection(a, b) {
		inx = [];
		for(var i = 0; i < a.length; i++) {
			for(var j = 0; j < b.length; j++) {
				if(a[i] == b[j]) {
					inx.push(a[i]);
					break;
				}
			}
		}
		inx = inx.filter(function (v, i, a) { return a.indexOf (v) == i }); // dedupe array
		return inx;
	}
	//returns the union of arrays a and b
	function _union(a, b) {
		un = a.slice(0);
		for(var i = 1; i < b.length; i++) {
			if(jQuery.inArray(b[i], un) == -1) {
				un.push(b[i]);
			}
		}
		return un;
	}
	function _getTagByName(tag_name) {
		var tag_id = _tag_lookup[tag_name];
		var tag = _tags[tag_id];
		return tag;
	}
	function getSelectedTagIds() {
		tags = [];
		$.each(_tags, function(tag_id, tag) {
			if(tag['s']) {
				tags.push(parseInt(tag_id));
			}
		});
		return _alphabetizeTagIds(tags);
	}
	function getQuestion(id){
		if(id) {
			return _flashcards[id]['q'];
		}
	}
	function getAnswer(id){
		if(id) {
			return _flashcards[id]['a'];
		}
	}
	function getSource(id){
		if(id) {
			return _flashcards[id]['s'];
		}
	}
	function getAllTagIds() {
		var all_tag_ids = [];
		$.each(_tags, function(key, hash) {
			all_tag_ids.push(key);
		});
		return all_tag_ids;
	}
	//returns an array of arrays
	function getFlashcardTagNames(flashcard_id) {
		if(flashcard_id) {
			var tag_ids = _flashcards[flashcard_id]['t'];
			var names = [];
			for(i = 0; i < tag_ids.length; i++) {
				var id = tag_ids[i];
				names.push(_tag_lookup[id]);
			}
			return names;
		}
		else {
			return [];
		}
	}
	function getFlashcardTagIds(flashcard_id) {
		if(flashcard_id) {
			var tag_ids = _flashcards[flashcard_id]['t'];
			return tag_ids;
		}
	}
	function setQuestion(id, question){
		_flashcards[id]['q'] = question;
	}
	function setAnswer(id, answer){
		_flashcards[id]['a'] = answer;
	}
	function setSource(id, src){
		_flashcards[id]['s'] = src;
	}
	function setFlashcardAsCurrent(id) {
		//find current flashcard, set it as not current
		$.each(_flashcards, function(flashcard_id, flashcard) {
			if(flashcard['c']) {
				flashcard['c'] = false;
			}
		});
		if(id) {
			_flashcards[id]['c'] = true;
			_flashcards[id]['u'] = false;
		}
	}
	function getTagName(id) {
		return _tags[id]['n'];
	}
	function getNumberOfSeenFlashcardsUnderCurrentTags() {
		selected_tag_ids = getSelectedTagIds();
		if(selected_tag_ids.length == 0) {
			flashcard_ids = _flashcard_ids;
		}
		else {
			flashcard_ids = _getFlashcardIdsWithTags(selected_tag_ids);
		}
		n = 0;
		$.each(flashcard_ids, function(index, flashcard_id) {
			if(_flashcards[flashcard_id]['u'] == false) {
				n++;
			}
		});
		return n;
	}
	function getNumberOfFlashcardsUnderCurrentTags() {
		selected_tag_ids = getSelectedTagIds();
		if(selected_tag_ids.length == 0) {
			flashcard_ids = _flashcard_ids;
		}
		else {
			flashcard_ids = _getFlashcardIdsWithTags(selected_tag_ids);
		}
		return flashcard_ids.length;
	}
	function tagIsSelected(id) {
		return _tags[id]['s'];
	}
	function setTagSelected(id) {
		_tags[id]['s'] = true;
	}
	function setTagUnselected(id) {
		_tags[id]['s'] = false;
	}
	function isShown(id) {
		return _flashcards[id]['c'];
	}
	function getTotalFlashcards() {
		return _flashcard_ids.length;
	}
	function _getCurrentFlashcard() {
		$.each(_flashcards, function(key, flashcard) {
			if(flashcard['c']) {
				return flashcard;
			}
		});
	}
	function getNextFlashcardId() {
		var selected_tag_ids = getSelectedTagIds();
		var candidates = _getFlashcardIdsWithTags(selected_tag_ids);
		if(candidates.length != 0) {
			candidates = _filterForAvailableFlashcardIds(candidates);
			if(candidates.length == 0) { //all must be unseen here
				_setFlashcardsUnseen(candidates);
				candidates = _filterForAvailableFlashcardIds(candidates);
			}
		}
		return candidates[Math.floor(Math.random()*candidates.length)]; //returns undefined if candidates is empty
	}
	function _getFlashcardIdsWithTags(tag_ids) {
		var candidates = [];
		if(tag_ids.length == 0) { //if no selected tags, show all flashcards
			$.each(_flashcards, function(flashcard_id, flashcard) {
				candidates.push(parseInt(flashcard_id));
			});
		}
		else {
			$.each(_flashcards, function(flashcard_id, flashcard) {
				var selected_tags_not_in_flashcard_tags = $.grep(tag_ids, function(el){return $.inArray(el, flashcard['t']) == -1}); //selected_tags_not_in_flashcard_tags is the list of tags that are selected, but not in the flashcard's tags. if it is empty, then all selected tags are in flashcard's tags and we want to show the flashcard.
				if(selected_tags_not_in_flashcard_tags.length == 0) {
					candidates.push(parseInt(flashcard_id));
				}
			});
		}
		return candidates;
	}
	//_filterForAvailableFlashcardIds finds all flashcards among candidates. if no candidates are unseen, it sets all candidates to unseen.
	function _filterForAvailableFlashcardIds(candidates) {
		available_candidate_ids = [];
		if (candidates.length != 0) {
			$.each(candidates, function(index, flashcard_id) {
				 if(_flashcards[flashcard_id]['c'] == false && _flashcards[flashcard_id]['u'] == true) {
					 available_candidate_ids.push(flashcard_id);
				 }
			});
		}
		return available_candidate_ids;
	}
	function _setFlashcardsUnseen(candidates) {
		$.each(_flashcards, function(flashcard_id, flashcard) {	
			flashcard['u'] = true;
		});
	}
	
	function _alphabetizeTagIds(tag_ids) {
		var tag_ids_by_name = {};
		var tag_names = [];
		$.each(tag_ids, function(index, id) {
			tag_ids_by_name[_tags[id]['n']] = id;
			tag_names.push(_tags[id]['n']);
		});
		tag_names.sort();
		var sorted_tag_ids = [];
		for(var i = 0; i < tag_names.length; i++) {
			sorted_tag_ids.push(tag_ids_by_name[tag_names[i]]);
		}
		return sorted_tag_ids;
	}
	function _arrayLengthComparatorDesc(a,b){
		if (a.length < b.length) return 1;
		if (a.length > b.length) return -1;
		return 0;
	}
	function getFlashcardTagHierarchies(flashcard_id) {
		var tag_hierarchy_ids = _getFlashcardTagHierarchyTagIds(flashcard_id);
		var tag_hierarchies = [];
		$.each(tag_hierarchy_ids, function(i, hierarchy) {
			var hierarchy = [];
			$.each(hierarchy, function(j, tag_id) {
				hierarchy.push(_tag_lookup[tag_id]);
			});
			tag_hierarchies.push(hierarchy);
		});
		return tag_hierarchies;
	}
	function getTopLevelTagIds() {
		var top_tag_ids = Object.keys(_tag_hierarchy);
		var top_tag_ids = _alphabetizeTagIds(top_tag_ids)
		return top_tag_ids;
	}
	function getTagIdsUnderSelectedTags() {
		var selected_tag_ids = getSelectedTagIds();
		if(selected_tag_ids.length == 0) {
			tag_ids = getTopLevelTagIds();
		} else {
			tag_ids = _findLowestTagsChildren(selected_tag_ids);
		}
		return tag_ids;
	}
	function _findLowestTagsChildren(tag_ids) {
		h = _tag_hierarchy;
		while(tag_ids.length > 0) {
			var parent_tag_id = _findParentTagId(tag_ids, h);
			var h = h[parent_tag_id];
			var index = tag_ids.indexOf(parent_tag_id);
			tag_ids.splice(index, 1);
		}
		return Object.keys(h);
	}
	function _findParentTagId(selected_tag_ids, sub_hierarchy) { //there should only be one tag_id that is a key to sub_hierarchy
		var parent_tag_id = null;
		$.each(selected_tag_ids, function(i, tag_id) {
			if(sub_hierarchy[tag_id]) {
				parent_tag_id = tag_id;
			}
		});
		return parent_tag_id;
	}
	
	window.getAnswer = getAnswer;
	window.getSource = getSource;
	window.getAllTagIds = getAllTagIds;
	window.getFlashcardTagNames = getFlashcardTagNames;
	window.setQuestion = setQuestion;
	window.setAnswer = setAnswer;
	window.setSource = setSource;
	window.setFlashcardAsCurrent = setFlashcardAsCurrent;
	window.getQuestion = getQuestion;
	window.getAnswer = getAnswer;
	window.getSource = getSource;
	window.isShown = isShown;
	window.getTotalFlashcards = getTotalFlashcards;
	window.getNextFlashcardId = getNextFlashcardId;
	window.getTagName = getTagName;
	window.tagIsSelected = tagIsSelected;
	window.setTagSelected = setTagSelected;
	window.setTagUnselected = setTagUnselected;
	window.getSelectedTagIds = getSelectedTagIds;
	window.getFlashcardTagIds = getFlashcardTagIds;
	window.getNumberOfSeenFlashcardsUnderCurrentTags = getNumberOfSeenFlashcardsUnderCurrentTags;
	window.getNumberOfFlashcardsUnderCurrentTags = getNumberOfFlashcardsUnderCurrentTags;
	window.getFlashcardTagHierarchies = getFlashcardTagHierarchies;
	window.getTopLevelTagIds = getTopLevelTagIds;
	window.getTagIdsUnderSelectedTags = getTagIdsUnderSelectedTags;
	//test
	window._findParentTagId = _findParentTagId;
	//endtest
	
})(window);
