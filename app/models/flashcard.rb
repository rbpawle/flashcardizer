class Flashcard < ActiveRecord::Base
  attr_accessible :answer, :date, :question, :source, :subject_id, :category_id, :from_csv, :subject, :category, :topic_id, :importance, :comprehension
  
  def self.assign_topic_id_for_all
  	fcs = Flashcard.all
  	fcs.each do |f|
  		subject = Topic.first(:conditions => {:topic => f.subject, :parent_id => 0})
  		category = Topic.first(:conditions => {:topic => f.category, :parent_id => subject.id})
  		f.topic_id = category.id
  		f.save
  	end
  end
  
  def self.simulate_controller
	  @flashcards = Flashcard.all
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
				puts t.id.to_s if t.topic.nil?
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
  
end
