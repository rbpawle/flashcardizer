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
  	@new_flashcard = Flashcard.where(:subject => "", :category => "", :question => "", :answer => "", :subject_id => 0, :category_id => 0)
  	if @new_flashcard.empty?
	  	Flashcard.new(:subject => "", :category => "", :question => "", :answer => "", :subject_id => 0, :category_id => 0).save
  	end
  	@new_flashcard = Flashcard.where(:subject => "", :category => "", :question => "", :answer => "", :subject_id => 0, :category_id => 0).first
  end
  
  def upload
		FlashcardCSV.csv_to_flashcards(params[:upload_file].tempfile)
  	redirect_to "/"
  end
  
  def create
  	if params[:flashcard][:subject].empty? || params[:flashcard][:category].empty? ||
  		params[:flashcard][:question].empty? || params[:flashcard][:answer].empty?
  		flash[:notice] = "Something's missing..."
  	else
			subject = Subject.where(:subject => params[:flashcard][:subject]).first
			if subject.nil?
				subject = Subject.new(:subject => params[:flashcard][:subject])
				subject.save
			end
			category = Category.where(:subject => params[:flashcard][:subject], :category => params[:flashcard][:category]).first
			if category.nil?
				category = Category.new(:subject => params[:flashcard][:subject], :category => params[:flashcard][:category])
				category.save
			end
			flashcard = Flashcard.where(:subject => params[:flashcard][:subject], :category => params[:flashcard][:category],
				:question => params[:flashcard][:question], :answer => params[:flashcard][:answer])
			if flashcard.empty?
				Flashcard.new(:subject => params[:flashcard][:subject], :category => params[:flashcard][:category],
					:question => params[:flashcard][:question], :answer => params[:flashcard][:answer], :category_id => category.id,
					:subject_id => subject.id, :date => Date.today).save
			end
		end
  	redirect_to "/"
  end
end
