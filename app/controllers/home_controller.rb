class HomeController < ApplicationController
  def home
  	@flashcard = Flashcard.new
  end
end
