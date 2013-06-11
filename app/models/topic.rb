class Topic < ActiveRecord::Base
  attr_accessible :parent_id, :topic
  #parent is the id of the parent topic of this topic
  #parent of 0 value means this is a root topic (aka subject)
  
  def self.flashcard_subjects_and_categories_to_topics
  	Topic.all.each {|t| t.delete}
  	fc = Flashcard.all
  	fc.each do |f|
  		subject = Topic.first(:conditions => {:topic => f.subject})
  		if subject.nil?
  			subject = Topic.new(:topic => f.subject, :parent_id => 0)
  			subject.save
  		end
  		category = Topic.first(:conditions => {:topic => f.category, :parent_id => subject.id})
  		if category.nil?
  			category = Topic.new(:topic => f.category, :parent_id => subject.id)
  			category.save
  		end
  	end
  end
  
  #topic_chain returns an array that starts with the highest non-zero parent-level topic_id and ends with the topic's id
  def topic_chain
  	chain = [self]
  	if self.parent_id != 0
			parent = Topic.find(self.parent_id)
			chain = [parent] + chain
			while parent.parent_id != 0
				parent = Topic.find(parent.parent_id)
				chain = [parent] + chain
			end
		end
  	return chain
  end
end
