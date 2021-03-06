# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130711172726) do

  create_table "categories", :force => true do |t|
    t.string   "subject"
    t.string   "category"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "flashcard_csvs", :force => true do |t|
    t.text     "csv"
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "flashcards", :force => true do |t|
    t.date     "date"
    t.text     "question"
    t.text     "answer"
    t.text     "source"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.integer  "subject_id"
    t.integer  "category_id"
    t.boolean  "from_csv"
    t.string   "subject"
    t.string   "category"
    t.integer  "topic_id"
    t.integer  "importance"
    t.integer  "comprehension"
  end

  create_table "flashcards_tags", :id => false, :force => true do |t|
    t.integer "flashcard_id"
    t.integer "tag_id"
  end

  add_index "flashcards_tags", ["flashcard_id", "tag_id"], :name => "index_flashcards_tags_on_flashcard_id_and_tag_id"
  add_index "flashcards_tags", ["tag_id"], :name => "index_flashcards_tags_on_tag_id"

  create_table "parent_tags", :force => true do |t|
    t.integer  "parent_tag_id"
    t.integer  "child_tag_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "subjects", :force => true do |t|
    t.string   "subject"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "topics", :force => true do |t|
    t.string   "topic"
    t.integer  "parent_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "level"
  end

end
