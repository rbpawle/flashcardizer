require 'csv'

class FlashcardCSV < ActiveRecord::Base
  attr_accessible :csv, :name
  def self.csv_to_flashcards(csv)
  	CSV.foreach(csv, :headers => ["date", "subject", "category", "question", "answer", "source"]) do |row|
  		Flashcard.new(:date => row["date"], :subject => row["subject"], :category => row["category"],
  			:question => row["question"], :answer => row["answer"], :source => "source").save
  	end
  end
end
