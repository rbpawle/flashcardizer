class AddLevelToTopic < ActiveRecord::Migration
  def change
    add_column :topics, :level, :integer
  end
end
