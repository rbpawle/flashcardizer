class CreateTagHierarchies < ActiveRecord::Migration
  def change
    create_table :tag_hierarchies do |t|
      t.string :tag_ids

      t.timestamps
    end
  end
end
