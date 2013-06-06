class HomeController < ApplicationController
  def home
  	@csv = FlashcardCSV.new
  	@subjects = Subject.all.sort! {|a,b| a.subject.downcase <=> b.subject.downcase }
  	@categories = {}
  	@flashcards = {}
  	@subjects.each do |s|
  		@categories[s.id] = Category.where(:subject => s.subject).sort! {|a,b| a.category.downcase <=> b.category.downcase }
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
  	p = params[:flashcard]
  	if p[:subject].empty? || p[:category].empty? ||
  		p[:question].empty? || p[:answer].empty?
  		flash[:notice] = "Something's missing..."
  	else
			#delete at provided id
			f = Flashcard.where(:id => p[:id])
			f[0].delete unless f.empty?
			subject = Subject.where(:subject => p[:subject]).first
			if subject.nil?
				subject = Subject.new(:subject => p[:subject])
				subject.save
			end
			category = Category.where(:subject => p[:subject], :category => p[:category]).first
			if category.nil?
				category = Category.new(:subject => p[:subject], :category => p[:category])
				category.save
			end
			flashcard = Flashcard.where(:subject => p[:subject], :category => p[:category],
				:question => p[:question], :answer => p[:answer], :source => p[:source])
			if flashcard.empty?
				Flashcard.new(:subject => p[:subject], :category => p[:category],
					:question => p[:question], :answer => p[:answer], :category_id => category.id,
					:subject_id => subject.id, :source => p[:source], :date => Date.today).save
			end
		end
  end
end
