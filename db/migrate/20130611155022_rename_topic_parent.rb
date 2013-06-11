class RenameTopicParent < ActiveRecord::Migration
  def up
    rename_column :topics, :parent, :parent_id
  end

  def down
    rename_column :topics, :parent_id, parent
  end
end
