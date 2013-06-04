class CreateFlashcardCsvs < ActiveRecord::Migration
  def change
    create_table :flashcard_csvs do |t|
      t.text :csv
      t.string :name

      t.timestamps
    end
  end
end
