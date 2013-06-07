require 'csv'
require 'fileutils'

class FlashcardCSV < ActiveRecord::Base
  attr_accessible :csv, :name
  def self.csv_to_flashcards(csv)
  	Flashcard.where(:from_csv => true).each {|f| f.delete}
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
  
  def self.fix_csv_dates
  	temp = File.open(Rails.root.to_s + "/corrected_tests.temp.csv", "w")
  	CSV.foreach(Rails.root.to_s + "/corrected_tests.csv", :headers => ["date", "subject", "category", "question", "answer", "source"]) do |row|
  		date_a = row["date"].split("/")
  		new_date = date_a[2] + "-" + date_a[0] + "-" + date_a[1]
  		temp << '"' + new_date + '","' + row["subject"].to_s.gsub('"', "'") + '","' + row["category"].to_s.gsub('"', "'") + '","' + row["question"].to_s.gsub('"', "'") + '","' + row["answer"].to_s.gsub('"', "'") + '","' + row["source"].to_s.gsub('"', "'") + "\"\n"
  	end
  	temp.close
  end
end
