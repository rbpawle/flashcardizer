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
	}
	
	//returns array of tag strings that share the same questions, sorted by the tags that have the most flashcards
	function getAssociatedTagsSortedByPopularity(tags) {
		
	}
	
	//takes a list of strings that are tags, finds the _tag object for them, and returns a string sorted by number of flashcards, highest first
	function _sortTagsByPopularity(tags) {	
		sortable = [];
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
	
	function _getAssociatedTags(tags) {
		var associated_tags = [];
		$.each(tags, function(tag) {
			associated_tags.concat(_tags[tag]['associated_tags']);
		});
		$.each(tags, function(tag) {
			this_associated_tags = _tags[tag]['associated_tags'];
			for(var i = 0; i < associated_tags.length; i++) {
				if(jQuery.inArray(associated_tags[i], this_associated_tags) == -1){ //if associated_tags[i] is not in associated_tags
					associated_tags.splice(i, 1);
					i--;
				}
			}
		});
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
	window._sortTagsByPopularity = _sortTagsByPopularity; //TEST, REMOVE!!
})(window);
