class Tag < ActiveRecord::Base
  attr_accessible :name
  has_and_belongs_to_many :flashcards
  
  def self.init
  	self.make_root_tag
  	self.topics_to_tags
  	self.tag_flashcards
  	self.assign_parent_tags
  end
  
  def self.make_root_tag
  	self.root_tag
  end
  
  def self.root_tag
  	root = Tag.first(:conditions => {:name => "root"})
  	if root.nil?
  		root = Tag.new(:name => 'root')
  		root.save
  	end
  	return root
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
  		f.tags = tags #no save needed
  	end
  end

	#finds all parent topics for old topics, assigns parent tags
	def self.assign_parent_tag_ids
		Topic.all.each do |topic|
			if topic.parent_id == 0
				parent_tag = Tag.root_tag
			else
				parent_tag = Tag.first(:conditions => {:name => Topic.find(topic.parent_id).topic})
			end
			tag = Tag.first(:conditions => {:name => Topic.find(topic.id).topic})
			tag.parent_tag_ids = parent_tag.id.to_s
			tag.save
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

	def parent_tags
		p_tag_ids = self.parent_tag_ids.split(",")
		p_tags = []
		p_tag_ids.each do |id|
			p_tags << Tag.find(id.to_i)
		end
		return p_tags
	end
end
