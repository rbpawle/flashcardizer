class Tag < ActiveRecord::Base
  attr_accessible :name
  has_and_belongs_to_many :flashcards
  
  def self.init
  	self.topics_to_tags
  	root = Tag.where(:name => "root").first
  	root.delete unless root.nil?
  	Flashcard.assign_tags_from_topics
  end
  
  def self.topics_to_tags
  	Topic.all.each do |topic|
  		existing = Tag.first(:conditions => {:name => topic.topic})
  		unless existing
  			Tag.new(:name => topic.topic).save
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
  
  def associated_tag_ids
		associated_tag_ids = []
		self.associated_tags.each {|a| associated_tag_ids << a.id}
		return associated_tag_ids
  end
  
  def associated_tag_names
  	names = []
  	self.associated_tags.each do |t|
  		names << t.name
  	end
  	return names
  end
  
  def associated_tags_with_cooccurrence_counts
		cooccurrence_counts = {}
  	self.flashcards.each do |f|
  		f.tags.each do |t|
  			if t != self
					if cooccurrence_counts[t.id].nil?
						cooccurrence_counts[t.id] = 1
					else
						cooccurrence_counts[t.id] += 1
					end
				end
  		end
  	end
  	return cooccurrence_counts
  end
  
  def coocurrence_json
  	json_a = []
  	self.associated_tags_with_cooccurrence_counts.each do |id, count|
  		json_a << id.to_s + ":" + count.to_s
  	end
  	return json_a.join(",")
  end
	
	def to_json
		flashcard_ids = []
		self.flashcards.each {|f| flashcard_ids << f.id }
		json = '"' + self.id.to_s + "\": {\n" 
		json << "n: '" + self.name.gsub("'", '"') + "',\n"
		json << "f: [" + flashcard_ids.join(",") + "],\n"
		json << "s: false,\n"
		json << "a: {" + self.coocurrence_json + "}"
		json << "}"
		return json
	end
	
  def self.random
  	return self.all[rand(self.all.length)]
  end
end
