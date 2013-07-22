class RemoveParentChildFromTag < ActiveRecord::Migration
  def up
    remove_column :tags, :parent_tag_id
    remove_column :tags, :child_tag_ids
  end

  def down
    add_column :tags, :child_tag_ids, :text
    add_column :tags, :parent_tag_id, :integer
  end
end
