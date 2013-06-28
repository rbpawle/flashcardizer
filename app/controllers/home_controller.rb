class HomeController < ApplicationController
  def home
		flashcards = Flashcard.all
		flashcards_json_a = []
		flashcards.each do |f|
			this_json = f.id.to_s + ": {\n"
			this_json << "question: \"" + f.question.gsub('"', "\"").gsub("\n", '\n') + "\",\n"
			this_json << "answer: \"" + f.answer.gsub('"', "\"").gsub("\n", '\n') + "\",\n"
			this_json << "source: \"" + f.source.gsub('"', "\"").gsub("\n", '\n') + "\",\n"
			this_json << "date: \"" + f.date.to_s.gsub('"', "\"") + "\",\n"
			tag_names = []
			f.tags.each {|tag| tag_names << tag.name }
			this_json << "tags: [\"" + tag_names.join("\", \"") + "\"],\n"
			this_json << "unseen: true\n,"
			this_json << "currently_shown: false,\n"
			this_json << "last_seen: false\n"
			this_json << "}"
			flashcards_json_a << this_json
		end
		@json = ("var flashcards = {\n" + flashcards_json_a.join(",\n") + "\n};\n").html_safe
		tags = Tag.all
		tags_json_a = []
		tags.each do |t|
			tag_flashcards = t.flashcards
			flashcard_ids = []
			tag_flashcards.each {|f| flashcard_ids << f.id }
			tags_json_a << '"' + t.name.gsub('"', "\"") + "\": [" + flashcard_ids.join(", ") + "]"
		end
		@json << ("var tags = {\n" + tags_json_a.join(",\n") + "\n};\n").html_safe
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
