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
		topic_name = "Machine Learning"
	  existing_topic = Topic.where(:topic => topic_name)
		if existing_topic.empty?
			if i == 0
				flashcard_topic = Topic.new(:topic => topic_name, :parent_id => 0)
			else
				t = Topic.where(:topic => parent_name)[0]
				flashcard_topic = Topic.new(:topic => topic_name, :parent_id => t.id)
			end
			flashcard_topic.save
		else
			flashcard_topic = existing_topic[0]
			if flashcard_topic.level != 0
				save_new_flashcard = false
				flash = "Flashcard not saved! Topic " + flashcard_topic.topic.to_s + " not in the proper hierarchy! Check its hierarchy and try again."
			end
		end
		if flash
			puts flash
		else
			puts "ok"
		end
  end
  
end
