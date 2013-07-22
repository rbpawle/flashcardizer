function navBarClicked(tab) {
	resetUpdateFields();
	hideAnswerAndSource();
	showTab(tab);
}

function showTab(tab) {
	$("#tabs").children().hide();
	$(tab).show();
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
		return alphabetizeTagIds(tags);
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
	//the below method finds all flashcards among candidates. if no candidates are unseen, it sets all candidates to unseen.
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
	function getAssociatedTagIds() {
		var selected_tag_ids = getSelectedTagIds();
		var associated_tag_ids = [];
		if(selected_tag_ids.length == 0) {
			$.each(_tags, function(tag_id, tag) {
				associated_tag_ids.push(parseInt(tag_id));
			});
		}
		else { //we get the intersection of all the selected tags' associated tags
			var associated = _tags[selected_tag_ids[0]]['a'];
			$.each(associated, function(tag_id, count){
				associated_tag_ids.push(parseInt(tag_id));
			});
			for(var i = 1; i < selected_tag_ids.length; i++) {
				$.each(_tags[selected_tag_ids[i]]['a'], function(tag_id, count) {
					if(associated_tag_ids.indexOf(tag_id) == -1) {
						associated_tag_ids = $.grep(associated_tag_ids, function(id) {
							return id != tag_id;
						});
					}
				});
			}
		}
		return alphabetizeTagIds(associated_tag_ids);
	}
	function getTagFont(tag_id) {
		flashcard_ids = _getFlashcardIdsWithTags(getSelectedTagIds());
		flashcard_count = 0;
		$.each(flashcard_ids, function(index, flashcard_id) {
			if(_tags[tag_id]['f'].indexOf(flashcard_id) != -1) {
				flashcard_count += 1;
			}
		});
		this_ratio = parseFloat(flashcard_count) / Math.sqrt(parseFloat(flashcard_ids.length));
		console.log(this_ratio);
		return parseInt(80.0 + 20.0 * this_ratio);
	}
	
	function averageFlashcardRatioForSelectedTags() {
		n_selected_tags = parseFloat(getAssociatedTagIds().length);
		if(n_selected_tags == 0.0) {
			n_selected_tags = getAllTagIds().length;
		}
		return n_selected_tags / parseFloat(getNumberOfFlashcardsUnderCurrentTags());
	}
	function alphabetizeTagIds(tag_ids) {
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
	function getNTagsToShow(n_to_show) {
		var unique_tag_sequences = _getUniqueTagSequencesAmongFlashcardsUnderSelectedTags();
		var tag_frequencies = {};
		var singly_occuring_tags = [];
		selected_tag_ids = getSelectedTagIds();
		$.each(unique_tag_sequences, function(index, this_tag_sequence){
			if(this_tag_sequence.length == 1 && selected_tag_ids.indexOf(this_tag_sequence[0]) == -1) {
				singly_occuring_tags.push(this_tag_sequence[0]);
			} else {
				$.each(this_tag_sequence, function(index, tag_id) {
					if(tag_frequencies.hasOwnProperty(tag_id)) {
						tag_frequencies[tag_id]++;
					}
					else {
						tag_frequencies[tag_id] = 1;
					}
				});
			}
		});
		tag_frequencies = hashKeysSortedByValue(tag_frequencies);
		tags_to_show = singly_occuring_tags; //we want to include all singly-occuring tags so they don't get lost
		i = tags_to_show.length;
		$.each(tag_frequencies, function(index, tag_id) {
			tag_id = tag_id;
			if(i < n_to_show && tags_to_show.indexOf(tag_id) == -1 && selected_tag_ids.indexOf(tag_id) == -1) {
				tags_to_show.push(tag_id);
				i++;
			}
		});
		tags_to_show = alphabetizeTagIds(tags_to_show);
		return tags_to_show;
	}
	function _getUniqueTagSequencesAmongFlashcardsUnderSelectedTags() {
		var flashcard_ids = _getFlashcardIdsWithTags(getSelectedTagIds());
		var unique_tag_hash = {};
		$.each(flashcard_ids, function(index, flashcard_id) {
			var tags = _flashcards[flashcard_id]['t'];
			if(!unique_tag_hash.hasOwnProperty(tags)) {
				unique_tag_hash[tags] = index;
			}
		});
		unique_tag_sequences = [];
		$.each(unique_tag_hash, function(tags, index) {
			ids = tags.split(",");
			tag_ids = [];
			$.each(ids, function(index, id) {
				tag_ids.push(parseInt(id));
			});
			unique_tag_sequences.push(tag_ids);
		});
		return unique_tag_sequences.sort(_arrayLengthComparatorDesc);
	}
	function _arrayLengthComparatorDesc(a,b){
		if (a.length < b.length) return 1;
		if (a.length > b.length) return -1;
		return 0;
	}
	function hashKeysSortedByValue(hash) {
		var tuples = [];
		for (var key in hash) tuples.push([key, hash[key]]);
		tuples.sort(function(a, b) {
			a = a[1];
			b = b[1];
			return a > b ? -1 : (a < b ? 1 : 0);
		});
		values = [];
		for (var i = 0; i < tuples.length; i++) {
			values.push(parseInt(tuples[i][0])); //careful of non-int keys
		}
		return values;
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
	window.getAssociatedTagIds = getAssociatedTagIds;
	window.tagIsSelected = tagIsSelected;
	window.setTagSelected = setTagSelected;
	window.setTagUnselected = setTagUnselected;
	window.getSelectedTagIds = getSelectedTagIds;
	window.getFlashcardTagIds = getFlashcardTagIds;
	window.getNumberOfSeenFlashcardsUnderCurrentTags = getNumberOfSeenFlashcardsUnderCurrentTags;
	window.getNumberOfFlashcardsUnderCurrentTags = getNumberOfFlashcardsUnderCurrentTags;
	window.getTagFont = getTagFont;
	window.alphabetizeTagIds = alphabetizeTagIds;
	window.getNTagsToShow = getNTagsToShow;
	//test
	window._getUniqueTagSequencesAmongFlashcardsUnderSelectedTags = _getUniqueTagSequencesAmongFlashcardsUnderSelectedTags;
	window._getFlashcardIdsWithTags = _getFlashcardIdsWithTags;
	//endtest
	
})(window);
