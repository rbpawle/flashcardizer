class AddSubjectAndCategoryToFlashcard < ActiveRecord::Migration
  def change
    add_column :flashcards, :subject, :string
    add_column :flashcards, :category, :string
  end
end
