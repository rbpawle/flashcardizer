class Flashcard < ActiveRecord::Base
  attr_accessible :answer, :category, :date, :question, :source, :subject
end
