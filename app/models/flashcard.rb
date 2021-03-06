class Flashcard < ActiveRecord::Base
  attr_accessible :answer, :date, :question, :source, :subject_id, :category_id, :from_csv, :subject, :category, :topic_id, :importance, :comprehension
  has_and_belongs_to_many :tags
  
  def self.assign_tags_from_topics
  	Flashcard.all.each do |f|
  		f.tags.delete
  		topics = Topic.find(f.topic_id).topic_chain
  		tags = []
  		topics.each do |topic|
  			tags << Tag.where(:name => topic.topic).first
  		end
  		f.tags = tags #no save needed
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
  
  def self.random
  	return self.all[rand(self.all.length)]
  end
end
