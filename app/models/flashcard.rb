class Flashcard < ActiveRecord::Base
  attr_accessible :answer, :category, :date, :question, :source, :subject
  
  def self.get_all_subjects
  	subjects = {}
  	Flashcard.all.each do |fc|
  		unless subjects.has_key? fc.subject
  			subjects[fc.subject] = 0
  		end
  	end
  	return subjects.keys
  end
end
