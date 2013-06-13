class HomeController < ApplicationController
  def home
  	if params[:date]
  		@flashcards = Flashcard.where(:date => params[:date])
  	else
  		@flashcards = Flashcard.all
		end
		#@topics will be an array of arrays of topics. the highest-level topics are in index 0, next-highest are in index 1, and so on.
		@topic_levels = []
		@flashcards_metadata = {}
		@flashcards.each do |f|
			chain = Topic.find(f.topic_id).topic_chain
			chain.each_index do |i|
				if @topic_levels[i].nil?
					@topic_levels[i] = [chain[i]]
				elsif @topic_levels[i].index(chain[i]).nil?
					@topic_levels[i] << chain[i]
				end
			end
			@flashcards_metadata[f.id] = {}
			topic_class = "topic_"
			topics_description = ""
			chain.each do |t|
				topic_class += t.id.to_s + " topic_"
				topics_description += t.topic.to_s + " > "
			end
			@flashcards_metadata[f.id][:topic_classes] = topic_class[0..(topic_class.length - 7)]
			@flashcards_metadata[f.id][:topics_description] = topics_description[0..(topics_description.length - 3)]
		end
		@dates = {}
		Flashcard.all.each do |f|
			unless @dates.has_key? f.date
				@dates[f.date] = 0
			end
		end
		@dates.delete(nil)
		@dates = @dates.keys.sort.reverse
		@flashcard_to_show_id = @flashcards[rand * (@flashcards.length - 1)].id		#pick random flashcard to show at beginning
		@topic_levels.each {|ts| ts.sort_by! {|t| t.topic.to_s } }
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
			#delete at provided id
			old_f = Flashcard.where(:id => p[:id])
			old_f[0].delete unless old_f.empty?
			f = Flashcard.new
			f.topic_id = flashcard_topic.id
			f.question = p[:question]
			f.answer = p[:answer]
			f.source = p[:source]
			f.date = date
			f.from_csv = false
			f.importance = p[:importance]
			f.comprehension = p[:comprehension]
			f.save if save_new_flashcard
		end
		redirect_to "/"
  end
end
