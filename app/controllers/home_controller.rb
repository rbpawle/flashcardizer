class HomeController < ApplicationController
  def home
  	@csv = FlashcardCSV.new
  end
  
  def upload
		FlashcardCSV.csv_to_flashcards(params[:upload_file].tempfile)
  	redirect_to "/"
  end
end
