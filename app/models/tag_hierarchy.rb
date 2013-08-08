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
	
	def to_json
		json = '"' + self.id.to_s + "\": {\n"
		json << "t:[" + self.tag_id_array.join(",") + "]\n"
		json << "}"
		return json
	end
  
end
