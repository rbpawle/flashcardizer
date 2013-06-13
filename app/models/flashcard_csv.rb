require 'csv'
require 'fileutils'

class FlashcardCSV < ActiveRecord::Base
  attr_accessible :csv, :name
  def self.csv_to_flashcards(csv)
  	CSV.foreach(csv, :headers => ["date", "0", "1", "2", "question", "answer", "source"]) do |row|
  		f = Flashcard.where(:question => row["question"], :answer => row["answer"])
  		if !f.empty?
  			f.each {|fl| fl.delete}
  		end
  		t0 = Topic.first(:conditions => {:topic => row["0"].strip})
  		if t0.nil?
  			t0 = Topic.new(:topic => row["0"].strip, :parent_id => 0)
  			t0.save
  		end
  		topic = t0
  		if row["1"] && !row["1"].empty?
				t1 = Topic.first(:conditions => {:topic => row["1"].strip})
				if t1.nil?
					t1 = Topic.new(:topic => row["1"].strip, :parent_id => t0.id)
					t1.save
				end
				topic = t1
			end
  		if row["2"] && !row["2"].empty?
				t2 = Topic.first(:conditions => {:topic => row["2"].strip})
				if t2.nil?
					t2 = Topic.new(:topic => row["2"].strip, :parent_id => t1.id)
					t2.save
				end
				topic = t2
  		end
			Flashcard.new(:date => row["date"], :topic_id => topic.id, :question => row["question"], :answer => row["answer"], :source => row["source"], :from_csv => true).save
  	end
  end
  
  def self.flashcards_to_csv(from, to)
  	csv = ""
  	i = 0
  	Flashcard.all.each do |f|
  		topic_chain = Topic.find(f.topic_id).topic_chain
  		t0 = topic_chain[0] ? topic_chain[0].topic.to_s.gsub('"', "'") : ""
  		t1 = topic_chain[1] ? topic_chain[1].topic.to_s.gsub('"', "'") : ""
  		t2 = topic_chain[2] ? topic_chain[2].topic.to_s.gsub('"', "'") : ""
  		if i >= from && i < to
	  		csv << '"' + f.date.to_s + '","' + t0 + '","' + t1 + '","' + t2 + '","' + f.question.to_s.gsub('"', "'") + '","' + f.answer.to_s.gsub('"', "'") + '","' + f.source.to_s.gsub('"', "'") + '"' + "\n"
	  	end
  		i += 1
  	end
  	puts csv
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
