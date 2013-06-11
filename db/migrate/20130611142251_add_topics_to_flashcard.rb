class AddTopicsToFlashcard < ActiveRecord::Migration
  def change
    add_column :flashcards, :topic, :string
  end
end
