require 'csv'

class FlashcardCSV < ActiveRecord::Base
  attr_accessible :csv, :name
  def self.csv_to_flashcards(csv)
  	Flashcard.where(:from_csv => true).each {|f| f.delete}
  	Subject.all.each {|s| s.delete}
  	Category.all.each {|s| s.delete}
  	CSV.foreach(csv, :headers => ["date", "subject", "category", "question", "answer", "source"]) do |row|
  		subject = Subject.where(:subject => row["subject"]).first
  		if subject.nil?
  			subject = Subject.new(:subject => row["subject"])
  			subject.save
  		end
  		category = Category.where(:subject => row["subject"], :category => row["category"]).first
  		if category.nil?
  			category = Category.new(:subject => row["subject"], :category => row["category"])
  			category.save
  		end
			Flashcard.new(:date => row["date"], :subject_id => subject.id, :category_id => category.id,
				:question => row["question"], :answer => row["answer"], :source => row["source"], :from_csv => true,
				:subject => subject.subject, :category => category.category).save
  	end
  end
end
