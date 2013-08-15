class HomeController < ApplicationController
	respond_to :html, :json

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
  	#if !p[:tags_0_0].empty? && !p[:question].empty? && !p[:answer].empty? && !p[:date].empty?
  		tag_hierarchies = _parse_tag_hierarchies(p)
  		File.open("hierarchies.txt", "w") {|f| f.puts tag_hierarchies.to_s }
  		@flashcard = Flashcard.new
  		render :json => {'message' => "saved."}, :success => :ok
		#end
  end
  
  def _parse_tag_hierarchies(p)
		tag_hierarchies = {}
		i = 0
		while p[("tags_" + i.to_s + "_" + j.to_s).to_sym]
			j = 0
			while p[("tags_" + i.to_s + "_" + j.to_s).to_sym]
				unless p[("tags_" + i.to_s + "_" + j.to_s).to_sym].empty?
					if tag_hierarchies[i].nil?
						tag_hierarchies[i] = {}
					end
					tag_hierarchies[i][j] = p[("tags_" + i.to_s + "_" + j.to_s).to_sym]
				end
				j += 1
			end
			i += 1
		end
		return tag_hierarchies
  end
end
