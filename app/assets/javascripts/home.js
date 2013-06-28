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
				tags_actual.push(_tags[tag[i]]);
			}
			var flashcard_ids = getFlashcardIdsUnderTags(tags);
		}
		return flashcard_ids[Math.floor(Math.random()*flashcard_ids.length)];
	}
	
	//tags should be an associative array of arrays keyed by tag; the sub-arrays are the flashcard id's under a given tag
	function getFlashcardIdsUnderTags(tags) { 
		if(tags.length < 2) {
			return tags[0];
		} else {
			var union = tags[0].slice(0);
			for(var i = 1; i < tags.length; i++) {
				for(var j = 0; j < union.length; j++) {
					if(jQuery.inArray(union[j], tags[i]) == -1) {
						union.splice(j, 1); //remove element from union
						j--;
					}
				}
			}
			return union;
		}
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
	
	window.getRandomFlashcardId = getRandomFlashcardId;
	window.getAnswer = getAnswer;
	window.getSource = getSource;
	window.setQuestion = setQuestion;
	window.setAnswer = setAnswer;
	window.setSource = setSource;
	window.getQuestion = getQuestion;
	window.getQuestion = getQuestion;
})(window);
