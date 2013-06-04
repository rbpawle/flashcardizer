class Flashcard < ActiveRecord::Base
  attr_accessible :answer, :category, :date, :question, :source, :subject
  
  def self.get_all_subjects
  	
  end
end
