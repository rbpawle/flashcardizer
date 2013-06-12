class AddTopicIdToFlashcard < ActiveRecord::Migration
  def change
    add_column :flashcards, :topic_id, :integer
  end
end
