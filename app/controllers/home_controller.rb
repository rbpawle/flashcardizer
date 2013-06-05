class HomeController < ApplicationController
  def home
  	@csv = FlashcardCSV.new
  	@subjects = Subject.all.sort! {|a,b| a.subject.downcase <=> b.subject.downcase }
  	@categories = {}
  	@flashcards = {}
  	@subjects.each do |s|
  		@categories[s.id] = Category.where(:subject => s.subject).sort! {|a,b| a.subject.downcase <=> b.subject.downcase }
  	end
  	@categories.each do |subject_id, categories|
  		categories.each do |category|
  			flashcards = Flashcard.where(:category_id => category.id)
  			@flashcards[category.id] = flashcards
  		end
  	end
  end
  
  def upload
		FlashcardCSV.csv_to_flashcards(params[:upload_file].tempfile)
  	redirect_to "/"
  end
end
