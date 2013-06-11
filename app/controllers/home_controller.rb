class HomeController < ApplicationController
  def home
  	if params[:date]
  		@flashcards = Flashcard.where(:date => params[:date])
  		subject_ids = []
  		@flashcards.each do |f|
  			if subject_ids[f.subject_id].nil?
  				subject_ids << f.subject_id
  			end
  		end
  		@subjects = Subject.find_all_by_id(subject_ids)
			@categories = {}
			@flashcards_temp = {}
			@flashcards.each do |f|
				if @flashcards_temp[f.category_id].nil?
					@flashcards_temp[f.category_id] = []
				end
				if @categories[f.subject_id].nil?
					@categories[f.subject_id] = []
				end
				category = Category.first(:conditions => {:id => f.category_id})
				unless category.nil?
					if @categories[f.subject_id].index(category).nil?
						@categories[f.subject_id] << category
					end
				end
				@flashcards_temp[f.category_id] << f
			end
			@flashcards = @flashcards_temp
			flashcards_not_used = Flashcard.all
			@dates = {}
			flashcards_not_used.each {|f| @dates[f.date] = 0 if @dates[f.date].nil?}
			@flashcards.each do |category_id, flashcards|
				flashcards_not_used.each {|f| @dates[f.date] = 0 if @dates[f.date].nil?}
			end
  	else
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
			@dates = {}
			@flashcards.each do |category_id, flashcards|
				flashcards.each {|f| @dates[f.date] = 0 if @dates[f.date].nil? && !f.date.nil?}
			end
		end
		@dates.delete(nil)
		@dates = @dates.keys.sort!
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
