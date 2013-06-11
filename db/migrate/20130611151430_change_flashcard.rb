class ChangeFlashcard < ActiveRecord::Migration
  def up
    remove_column :flashcards, :topics
    add_column :flashcards, :topic_id, :integer
  end

  def down
    add_column :flashcards, :topics, :string
    remove_column :flashcards, :topic_id
  end
end
