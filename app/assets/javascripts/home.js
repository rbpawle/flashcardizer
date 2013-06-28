function navBarClicked(tab) {
	resetUpdateFields();
	hideAnswerAndSource();
	showTab(tab);
}

function showTab(tab) {
	$("#tabs").children().hide();
	$(tab).show();
}

(function(window){
	//tags should be an array of strings of tag names; returns array of flashcard ids
	function getFlashcardIdsByTags(tags) {
		flashcard_ids = [];
		$.each(tags, function(i) {
			$.each(_tags[tags[i]]['flashcard_ids'], function(j) {
				flashcard_ids.push(_tags[tags[i]]['flashcard_ids'][j]);
			});
		});
		flashcard_ids = flashcard_ids.filter(function (v, i, a) { return a.indexOf (v) == i }); // dedupe array
		return flashcard_ids;
	}
	
	//tags is an array of string(s) or null
	function getRandomFlashcardId(tags) {
		if(tags == null) {
			var flashcard_ids = _flashcard_ids;
		} else {
			tags_actual = new Array;
			for(var i = 0; i < tags.length; i++) {
				tags_actual.push(_tags[tags[i]]['flashcard_ids']);
			}
			var flashcard_ids = _getFlashcardIdsUnderTags(tags_actual);
		}
		if(flashcard_ids.length == 0) {
			return null;
		} else {
			return flashcard_ids[Math.floor(Math.random()*flashcard_ids.length)];
		}
	}
	
	//tags should be an associative array of arrays keyed by tag; the sub-arrays are the flashcard id's under a given tag
	function _getFlashcardIdsUnderTags(tags) { 
		if(tags.length < 2) {
			return tags[0];
		} else {
			var union = tags[0].slice(0);
			for(var i = 1; i < tags.length; i++) {
				for(var j = 0; j < union.length; j++) {
					if(jQuery.inArray(union[j], tags[i]) == -1) { //if union[j] is not in tags[i]
						union.splice(j, 1); //remove element from union
						j--;
					}
				}
			}
			return union;
		}
	}
	
	//returns the intersection of arrays a and b
	function _intersection(a, b) {
		inx = [];
		for(var i = 0; i < a.length; i++) {
			for(var j = 0; j < b.length; j++) {
				if(a[i] == b[j]) {
					inx.push[a[i]];
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
	
	function getSelectedTags() {
		tags = [];
		$.each(_tags, function(key, hash) {
			if(hash['selected']) {
				tags.push(key);
			}
		});
		return tags;
	}
	
	//returns an array of all tag strings, sorted by popularity
	function getAllTagsSortedByPopularity() {
		var all_tags = getAllTags();
		return _sortTagsByPopularity(all_tags);
	}
	
	//returns array of tag strings that share the same questions, sorted by the tags that have the most flashcards
	function getAssociatedTagsSortedByPopularity(tags) {
		var associated_tags = _getAssociatedTags(tags);
		return _sortTagsByPopularity(associated_tags);
	}
	
	//takes a list of strings that are tags, returns a string sorted by number of flashcards for that tag, highest first
	function _sortTagsByPopularity(tags) {	
		var sortable = [];
		for(var i = 0; i < tags.length; i++) {
			tag = _tags[tags[i]];
			sortable.push({'tag': tags[i], 'n': tag['flashcard_ids'].length});
		}
		sortable.sort(function(a,b) {return b['n'] - a['n'];});
		return_tags = []
		for(var i = 0; i < sortable.length; i++) {
			return_tags.push(sortable[i]['tag']);
		}
		return return_tags;
	}
	
	//takes a list of strings that are tags, returns all tags that have the same flashcards
	function _getAssociatedTags(tags) {
		var associated_tags = [];
		$.each(tags, function(i) {
			for(var j = 0; j < _tags[tags[i]]['associated_tags'].length; j++) {
				associated_tags.push(_tags[tags[i]]['associated_tags'][j]);
			}
		});
		$.each(tags, function(i) {
			var this_associated_tags = _tags[tags[i]]['associated_tags'];
			for(var i = 0; i < associated_tags.length; i++) {
				if(jQuery.inArray(associated_tags[i], this_associated_tags) == -1){ //if associated_tags[i] is not in this_associated_tags
					associated_tags.splice(i, 1);
					i--;
				}
			}
		});
		associated_tags = associated_tags.filter(function (v, i, a) { return a.indexOf (v) == i }); // dedupe array
		return associated_tags;
	}
	
	function getQuestion(id){
		return _flashcards[id]['question'];
	}
	function getAnswer(id){
		return _flashcards[id]['answer'];
	}
	function getSource(id){
		return _flashcards[id]['source'];
	}
	function getAllTags() {
		var all_tags = [];
		$.each(_tags, function(key, hash) {
			all_tags.push(key);
		});
		return all_tags;
	}
	function getFlashcardTags(id) {
		return _flashcards[id]['tags'];
	}
	function setQuestion(question){
		_flashcards[id]['question'] = question;
	}
	function setAnswer(answer){
		_flashcards[id]['answer'] = answer;
	}
	function setSource(src){
		_flashcards[id]['source'] = src;
	}
	function isShown(id) {
		return _flashcards[id]['currently_shown'];
	}
	function getTotalQuestions() {
		return _flashcard_ids.length;
	}
	
	window.getFlashcardIdsByTags = getFlashcardIdsByTags;
	window.getRandomFlashcardId = getRandomFlashcardId;
	window.getSelectedTags = getSelectedTags;
	window.getAllTagsSortedByPopularity = getAllTagsSortedByPopularity;
	window.getAssociatedTagsSortedByPopularity = getAssociatedTagsSortedByPopularity;
	window.getAnswer = getAnswer;
	window.getSource = getSource;
	window.getAllTags = getAllTags;
	window.getFlashcardTags = getFlashcardTags;
	window.setQuestion = setQuestion;
	window.setAnswer = setAnswer;
	window.setSource = setSource;
	window.getQuestion = getQuestion;
	window.getQuestion = getQuestion;
	window.getSelectedTags = getSelectedTags;
	window.isShown = isShown;
	window.getTotalQuestions = getTotalQuestions;
})(window);
