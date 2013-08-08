class CreateFlashcardsTagHierarchiesTable < ActiveRecord::Migration
  def self.up
    create_table :flashcards_tag_hierarchies, :id => false do |t|
      t.references :flashcard
      t.references :tag_hierarchy
    end
    add_index :flashcards_tag_hierarchies, [:flashcard_id, :tag_hierarchy_id], :name => "flashcard_tag_hierarchy_index"
    add_index :flashcards_tag_hierarchies, :tag_hierarchy_id
  end

  def self.down
    drop_table :flashcards_tag_hierarchies
  end
end
