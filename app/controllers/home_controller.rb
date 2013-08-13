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
		@json << ("var _at_bottom_tag = false;\n").html_safe
		@new_flashcard = Flashcard.new
  end
  
  def upload
		FlashcardCSV.csv_to_flashcards(params[:upload_file].tempfile)
  	redirect_to "/"
  end
  
  def create
  	p = params[:flashcard]
  	if p[:topic_level_0].empty? || p[:question].empty? || p[:answer].empty? || p[:date].empty?
  		flash[:notice] = "Flashcard not saved! Something's missing..."
  	else
  		save_new_flashcard = true
			i = 0
			flashcard_topic = nil
			while p["topic_level_" + i.to_s] && p["topic_level_" + i.to_s][/^\s*$/].nil? && #in this loop, we add new topics to the database if they exist
				topic_name = p["topic_level_" + i.to_s].strip
				existing_topic = Topic.where(:topic => topic_name)
				if existing_topic.empty?
					if i == 0
						flashcard_topic = Topic.new(:topic => topic_name, :parent_id => 0, :level => 0)
					else
						t = Topic.where(:topic => p["topic_level_" + (i-1).to_s].strip)[0]
						flashcard_topic = Topic.new(:topic => topic_name, :parent_id => t.id, :level => i)
					end
					flashcard_topic.save
				else
					flashcard_topic = existing_topic[0]
					level = flashcard_topic.topic_chain.length - 1
					if level != i
						save_new_flashcard = false
						flash[:notice] = "Flashcard not saved! Topic " + flashcard_topic.topic.to_s + " not in the proper hierarchy! Check its hierarchy and try again."
					end
				end
				i += 1
			end#while
			date = Date.parse(p[:date])
			date = Date.today if date > Date.today
			f = Flashcard.new
			f.topic_id = flashcard_topic.id
			f.question = p[:question]
			f.answer = p[:answer]
			f.source = p[:source]
			f.date = date
			f.from_csv = false
			f.importance = p[:importance]
			f.comprehension = p[:comprehension]
			if save_new_flashcard
				#delete at provided id
				old_f = Flashcard.where(:id => p[:id])
				old_f[0].delete unless old_f.empty?
				f.save
			end
		end
		redirect_to "/"
  end
end
