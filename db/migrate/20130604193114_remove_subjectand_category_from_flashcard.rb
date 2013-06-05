class RemoveSubjectandCategoryFromFlashcard < ActiveRecord::Migration
  def up
    remove_column :flashcards, :subject
    remove_column :flashcards, :category
  end

  def down
    add_column :flashcards, :category, :string
    add_column :flashcards, :subject, :string
  end
end
