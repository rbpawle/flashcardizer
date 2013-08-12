class TagHierarchy < ActiveRecord::Base
  attr_accessible :tag_ids
  has_and_belongs_to_many :flashcards
  
  def self.init
  	Tag.topics_to_tags
  	Flashcard.flashcard_topics_to_tag_hierarchies
  end
  
  def self.get_tags_under_tag_by_id(tag_id)
  	tags = []
  	self.all.each do |th|
  		i = th.tag_id_array.index(tag_id)
  		if i
  			tags = tags | th.tag_id_array[i + 1..-1]
  		end
  	end
  	return tags
  end
  
  def tag_id_array
		tag_ids_s = self.tag_ids.split(",")
		tag_id_array = []
		tag_ids_s.each {|id| tag_id_array << id.to_i }
		return tag_id_array
  end
	
	def self.to_json
		hash = {}
		self.all.each do |th|
			hierarchy = th.tag_id_array
			h = hash #do you see what I did here?
			hierarchy.each_index do |i|
				if h[hierarchy[i]].nil?
					h[hierarchy[i]] = {}
				end
				h = h[hierarchy[i]] #now check that out. BOOM
			end
		end
		return hash.to_s.gsub("=>",":")
	end
  
  def self.tag_children_to_json
  	sub_hierarchies = {}
  	self.all.each do |th|
  		hierarchy = th.tag_id_array
  		hierarchy.each_index do |i|
  			break if i + 1 == hierarchy.length 
  			if sub_hierarchies[hierarchy[i]].nil?
  				sub_hierarchies[hierarchy[i]] = []
  			end
  			sub_hierarchies[hierarchy[i]] << hierarchy[i + 1]
  		end
  	end
  	return sub_hierarchies.to_s.gsub("=>",":")
  end
  
end
