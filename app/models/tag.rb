class Tag < ActiveRecord::Base
  attr_accessible :name, :parent_tag_id
  has_and_belongs_to_many :flashcards
  
  def self.init
  	self.make_root_tag
  	self.topics_to_tags
  	Flashcard.assign_tags_from_topics
  	self.assign_parent_tag_id
  	self.assign_child_tag_ids
  end
  
  def self.make_root_tag
  	self.root_tag
  end
  
  def self.root_tag
  	root = Tag.first(:conditions => {:name => "root"})
  	if root.nil?
  		root = Tag.new(:name => 'root', :parent_tag_id => 0)
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

	#finds all parent topics for old topics, assigns parent tags
	def self.assign_parent_tag_id
		Topic.all.each do |topic|
			if topic.parent_id == 0
				parent_tag = Tag.root_tag
			else
				parent_tag = Tag.first(:conditions => {:name => Topic.find(topic.parent_id).topic})
			end
			tag = Tag.first(:conditions => {:name => Topic.find(topic.id).topic})
			tag.parent_tag_id = parent_tag.id
			tag.save
		end
	end
	
	def self.assign_child_tag_ids
		Tag.all.each do |t|
			p = t.parent_tag
			puts t.attributes
			puts p.to_s
			if p && p.child_tags.empty?
				puts "yup"
				p.child_tag_ids = t.id.to_s
				p.save
			elsif p && p.child_tags.index(t).nil?
				p.child_tag_ids = p.child_tag_ids + "," + t.id.to_s
				p.save
			end
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

	def parent_tag
		p_tag = nil
		unless self.parent_tag_id == 0
			p_tag = Tag.find(self.parent_tag_id)
		end
		return p_tag
	end
	
	def child_tags
		c_tags = []
		unless self.child_tag_ids.nil?
			c_tag_ids = self.child_tag_ids.split(",")
			c_tag_ids.each do |c_tag_id|
				c_tags << Tag.find(c_tag_id)
			end
		end
		return c_tags
	end
	
	def to_json
		tag_flashcards = self.flashcards
		flashcard_ids = []
		tag_flashcards.each {|f| flashcard_ids << f.id }
		json = '"' + self.id.to_s + "\": {\n" 
		json << "n: '" + self.name.gsub("'", '"') + "',\n"
		json << "f: [" + flashcard_ids.join(", ") + "],\n"
		json << "s: false,\n"
		associated_tag_ids = []
		self.associated_tags.each {|a| associated_tag_ids << a.id}
		json << "a: [" + associated_tag_ids.join(",") + "],\n"
		json << "p: " + self.parent_tag_id.to_s + ",\n"
		child_tag_ids = []
		self.child_tags.each {|c| child_tag_ids << c.id.to_s}
		json << "c: [" + child_tag_ids.join(",") + "]\n"
		json << "}"
		return json
	end
end
