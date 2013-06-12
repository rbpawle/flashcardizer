class AddImportanceAndComprehensionToFlashcard < ActiveRecord::Migration
  def change
    add_column :flashcards, :importance, :integer
    add_column :flashcards, :comprehension, :integer
  end
end
