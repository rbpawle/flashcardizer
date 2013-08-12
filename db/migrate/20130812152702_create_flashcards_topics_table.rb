class CreateFlashcardsTopicsTable < ActiveRecord::Migration
  def up
    create_table :flashcards_topics, :id => false do |t|
      t.references :flashcard
      t.references :topic
    end
    add_index :flashcards_topics, [:flashcard_id, :topic_id]
    add_index :flashcards_topics, :topic_id
  end

  def down
    drop_table :flashcards_topics
  end
end
