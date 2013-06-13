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
				puts t.id.to_s
				topic_class += t.id.to_s + " topic_"
				topics_description += t.topic + " > "
			end
			@flashcards_metadata[f.id][:topic_classes] = topic_class[0..(topic_class.length - 7)]
			@flashcards_metadata[f.id][:topics_description] = topics_description[0..(topics_description.length - 3)]
		end
  end
  
end
