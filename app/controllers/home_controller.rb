class HomeController < ApplicationController
  def home
  	@csv = FlashcardCSV.new
  	@subjects = Flashcard.get_all_subjects
  end
  
  def upload
		FlashcardCSV.csv_to_flashcards(params[:upload_file].tempfile)
  	redirect_to "/"
  end
end
