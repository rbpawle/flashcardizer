class Flashcard < ActiveRecord::Base
  attr_accessible :answer, :date, :question, :source, :subject_id, :category_id, :from_csv, :subject, :category, :topic_id, :importance, :comprehension
  has_and_belongs_to_many :tags
  
  def self.assign_topic_id_for_all
  	fcs = Flashcard.all
  	fcs.each do |f|
  		subject = Topic.first(:conditions => {:topic => f.subject, :parent_id => 0})
  		category = Topic.first(:conditions => {:topic => f.category, :parent_id => subject.id})
  		f.topic_id = category.id
  		f.save
  	end
  end
  
  def self.assign_tags_from_topics
  	Flashcard.all.each do |f|
  		f.tags.delete
  		name = Topic.find(f.topic_id).topic
  		f.tags = Tag.where(:name => name) #no save needed
  	end
  end
  
  def to_json
		json = self.id.to_s + ": {\n"
		json << "q: \"" + self.question.gsub('"', "\"").gsub("\n", '\n') + "\",\n"
		json << "a: \"" + self.answer.gsub('"', "\"").gsub("\n", '\n') + "\",\n"
		json << "s: \"" + self.source.gsub('"', "\"").gsub("\n", '\n') + "\",\n"
		json << "d: \"" + self.date.to_s.gsub('"', "\"") + "\",\n"
		tag_ids = []
		self.tags.each {|tag| tag_ids << tag.id }
		json << "t: [" + tag_ids.join(",") + "],\n"
		json << "u: true,\n"
		json << "c: false,\n"
		json << "l: false\n"
		json << "}"
		return json
  end
end
