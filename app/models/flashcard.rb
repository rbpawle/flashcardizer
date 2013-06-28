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
  
end
