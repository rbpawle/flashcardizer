class AddChildTagIdsToTag < ActiveRecord::Migration
  def change
    add_column :tags, :child_tag_ids, :text
  end
end
