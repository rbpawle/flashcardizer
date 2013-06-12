class HomeController < ApplicationController
  def home
  	if params[:date]
  		@flashcards = Flashcard.where(:date => params[:date])
  	else
  		@flashcards = Flashcard.all
		end
		#@topics will be an array of arrays of topics. the highest-level topics are in index 0, next-highest are in index 1, and so on.
		@topic_levels = []
		@flashcards.each do |f|
			topic = Topic.find(f.topic_id)
			topic.topic_chain.each_index do |i|
				if @topic_levels[i].nil?
					@topic_levels[i] = [topic.topic_chain[i]]
				elsif @topic_levels[i].index(topic.topic_chain[i]).nil?
					@topic_levels[i] << topic.topic_chain[i]
				end
			end
		end
		@dates = {}
		Flashcard.all.each do |f|
			unless @dates.has_key? f.date
				@dates[f.date] = 0
			end
		end
		@dates.delete(nil)
		@dates = @dates.keys.sort.reverse
		@flashcard_to_show_id = @flashcards[rand(0..(@flashcards.length - 1))].id		#pick random flashcard to show at beginning
		@topic_levels.each {|ts| ts.sort_by! {|t| t.topic } }
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
