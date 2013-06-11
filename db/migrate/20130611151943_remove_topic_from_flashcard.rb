class RemoveTopicFromFlashcard < ActiveRecord::Migration
  def up
    remove_column :flashcards, :topic
  end

  def down
    add_column :flashcards, :topic, :string
  end
end
