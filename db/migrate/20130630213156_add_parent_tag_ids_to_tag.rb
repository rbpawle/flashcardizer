class AddParentTagIdsToTag < ActiveRecord::Migration
  def change
    add_column :tags, :parent_tag_ids, :text
  end
end
