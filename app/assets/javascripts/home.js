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
	//flashcard keys:
	//q: question
	//a: answer
	//s: source
	//d: date
	//t: tags
	//u: unseen
	//c: currently shown
	//l: last seen
	
	//tag keys:
	//n: name
	//f: flashcard ids
	//s: selected
	//a: associated tags
	//p: parent tags
	//c: child tags
	//tags should be an array of strings of tag names; returns array of flashcard ids
	function getFlashcardIdsByTags(tags) {
		flashcard_ids = [];
		$.each(tags, function(i) {
			$.each(_tags[tags[i]]['f'], function(j) {
				flashcard_ids.push(_tags[tags[i]]['f'][j]);
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
				tags_actual.push(_tags[tags[i]]['f']);
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
			if(hash['s']) {
				tags.push(key);
			}
		});
		return tags;
	}
	
	function getChildTagNames(tag_name) {
		var child_tag_names = [];
		var tag_id = _tag_id_name_lookup[tag_name];
		var tag = _tags[id];
		for(var i = 0; i < tag['c'].length; i++) {
			child_tag_names.push(_tag_id_name_lookup[tag['c']][i]);
		}
		return child_tag_names;
	}
	
	function getQuestion(id){
		return _flashcards[id]['q'];
	}
	function getAnswer(id){
		return _flashcards[id]['a'];
	}
	function getSource(id){
		return _flashcards[id]['s'];
	}
	function getAllTags() {
		var all_tags = [];
		$.each(_tags, function(key, hash) {
			all_tags.push(key);
		});
		return all_tags;
	}
	function getFlashcardTags(id) {
		return _flashcards[id]['t'];
	}
	function setQuestion(question){
		_flashcards[id]['q'] = question;
	}
	function setAnswer(answer){
		_flashcards[id]['a'] = answer;
	}
	function setSource(src){
		_flashcards[id]['s'] = src;
	}
	function isShown(id) {
		return _flashcards[id]['c'];
	}
	function getTotalQuestions() {
		return _flashcard_ids.length;
	}
	
	window.getFlashcardIdsByTags = getFlashcardIdsByTags;
	window.getRandomFlashcardId = getRandomFlashcardId;
	window.getSelectedTags = getSelectedTags;
	window.getChildTagNames = getChildTagNames;
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
