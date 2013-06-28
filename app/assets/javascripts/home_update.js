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

