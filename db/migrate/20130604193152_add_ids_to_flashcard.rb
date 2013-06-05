class AddIdsToFlashcard < ActiveRecord::Migration
  def change
    add_column :flashcards, :subject_id, :integer
    add_column :flashcards, :category_id, :integer
  end
end
