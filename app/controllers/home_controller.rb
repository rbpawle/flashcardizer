class HomeController < ApplicationController
  def home
		flashcards_json_a = []
		flashcard_ids = []
		Flashcard.all.each do |f|
			flashcards_json_a << f.to_json
			flashcard_ids << f.id
		end
		tags_json_a = []
		name_to_tag_id_a = []
		Tag.all.each do |t|
			tags_json_a << t.to_json
			name_to_tag_id_a << '"' + t.name + "\": " + t.id.to_s
			name_to_tag_id_a << '"' + t.id.to_s + "\": '" + t.name.gsub("'",'"') + "'"
		end
		@json = ("var _flashcards = {\n" + flashcards_json_a.join(",\n") + "\n};\n").html_safe
		@json << ("var _flashcard_ids = [" + flashcard_ids.join(",") + "];\n").html_safe
		@json << ("var _tags = {\n" + tags_json_a.join(",\n") + "\n};\n").html_safe
		@json << ("var _tag_lookup = {\n" + name_to_tag_id_a.join(",\n") + "}\n").html_safe
		@json << ("var _tag_hierarchy = " + TagHierarchy.to_json + "\n").html_safe
		@json << ("var _tag_children = " + TagHierarchy.tag_children_to_json + "\n").html_safe
		@new_flashcard = Flashcard.new
  end
  
  def upload
		FlashcardCSV.csv_to_flashcards(params[:upload_file].tempfile)
  	redirect_to "/"
  end
  
  def create
  	p = params["@new_flashcard"]
  	if p[:topic_level_0].empty? || p[:question].empty? || p[:answer].empty? || p[:date].empty?
  		flash[:notice] = "Flashcard not saved! Something's missing..."
  	else
		end
		redirect_to "/"
  end
end
