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
		@flashcard_to_show_id = @flashcards[rand(0..(@flashcards.length - 1))].id		#pick random flashcard to show at beginning
		@topic_levels.each {|ts| ts.sort_by! {|t| t.topic } }
		@new_flashcard = Flashcard.new
  end
  
  def upload
		FlashcardCSV.csv_to_flashcards(params[:upload_file].tempfile)
  	redirect_to "/"
  end
  
  def create
  	p = params[:flashcard]
  	if p[:topic_level_0].empty? || p[:question].empty? || p[:answer].empty?
  		flash[:notice] = "Something's missing..."
  	else
			#delete at provided id
			f = Flashcard.where(:id => p[:id])
			f[0].delete unless f.empty?
			i = 0
			flashcard_topic = nil
			while p["topic_level_" + i.to_s] && !p["topic_level_" + i.to_s].empty? #in this loop, we add new topics to the database if they exist
				topic_name = p["topic_level_" + i.to_s]
				existing_topic = Topic.where(:topic => topic_name)
				if existing_topic.empty?
					if i == 0
						flashcard_topic = Topic.new(:topic => topic_name, :parent_id => 0)
					else
						t = Topic.where(:topic => p["topic_level_" + (i-1).to_s])[0]
						flashcard_topic = Topic.new(:topic => topic_name, :parent_id => t.id)
					end
					flashcard_topic.save
				else
					flashcard_topic = existing_topic[0]
				end
				i += 1
			end#while
			Flashcard.new(:topic_id => flashcard_topic.id, :question => p[:question], :answer => p[:answer], :source => p[:source],
				:date => Date.today, :from_csv => false, :importance => p[:importance], :comprehension => p[:comprehension]).save
		end
		redirect_to "/"
  end
end
