class CreateFlashcardsTagsTable < ActiveRecord::Migration
  def self.up
    create_table :flashcards_tags, :id => false do |t|
        t.references :flashcard
        t.references :tag
    end
    add_index :flashcards_tags, [:flashcard_id, :tag_id]
    add_index :flashcards_tags, :tag_id
  end

  def self.down
    drop_table :flashcards_tags
  end
end
