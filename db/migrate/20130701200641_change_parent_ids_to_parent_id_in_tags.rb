class ChangeParentIdsToParentIdInTags < ActiveRecord::Migration
  def up
    change_column :tags, :parent_tag_ids, :integer
    rename_column :tags, :parent_tag_ids, :parent_tag_id
  end

  def down
    rename_column :tags, :parent_tag_id, :parent_tag_ids
    change_column :tags, :parent_tag_ids, :string
  end
end
