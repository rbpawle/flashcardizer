class CreateFlashcards < ActiveRecord::Migration
  def change
    create_table :flashcards do |t|
      t.date :date
      t.string :subject
      t.string :category
      t.text :question
      t.text :answer
      t.text :source

      t.timestamps
    end
  end
end
