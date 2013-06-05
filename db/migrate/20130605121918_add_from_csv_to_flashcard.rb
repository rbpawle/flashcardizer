class AddFromCsvToFlashcard < ActiveRecord::Migration
  def change
    add_column :flashcards, :from_csv, :boolean
  end
end
