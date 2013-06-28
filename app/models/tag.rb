class Tag < ActiveRecord::Base
  attr_accessible :name
  has_and_belongs_to_many :flashcards
  
  def self.init
  	self.topics_to_tags
  	self.tag_flashcards
  end
  
  def self.topics_to_tags
  	Topic.all.each do |topic|
  		existing = Tag.first(:conditions => {:name => topic.topic})
  		unless existing
  			Tag.new(:name => topic.topic).save
  		end
  	end
  end
  
  def self.tag_flashcards
  	Flashcard.all.each do |f|
  		topics = Topic.find(f.topic_id).topic_chain
  		tags = []
  		topics.each do |t|
  			tags << Tag.first(:conditions => {:name => t.topic})
  		end
  		f.tags = tags
  	end
  end
  
  #returns array of tags that have flashcards in common with this tag
  def associated_tags
		associated_tags = []
  	self.flashcards.each do |f|
  		f.tags.each do |t|
  			if associated_tags.index(t).nil? && t != self
	  			associated_tags << t
	  		end
  		end
  	end
  	return associated_tags
  end
  
  def associated_tag_names
  	names = []
  	self.associated_tags.each do |t|
  		names << t.name
  	end
  	return names
  end
end
