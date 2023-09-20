class CreateMemberships < ActiveRecord::Migration[7.0]
  def change
    create_table :memberships do |t|
      t.integer :user_id
      t.integer :beer_club_id

      t.timestamps
    end
  end
end
