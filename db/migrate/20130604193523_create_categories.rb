class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :subject
      t.string :category

      t.timestamps
    end
  end
end
