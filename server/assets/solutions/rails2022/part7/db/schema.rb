# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_09_08_065342) do
  create_table "beer_clubs", force: :cascade do |t|
    t.string "name"
    t.integer "founded"
    t.string "city"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "beers", force: :cascade do |t|
    t.string "name"
    t.integer "brewery_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "style_id"
  end

  create_table "breweries", force: :cascade do |t|
    t.string "name"
    t.integer "year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "active"
  end

  create_table "memberships", force: :cascade do |t|
    t.integer "user_id"
    t.integer "beer_club_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "confirmed"
  end

  create_table "ratings", force: :cascade do |t|
    t.integer "score"
    t.integer "beer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
  end

  create_table "styles", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.boolean "admin"
    t.boolean "closed"
    t.index ["username"], name: "index_users_on_username"
  end

end
