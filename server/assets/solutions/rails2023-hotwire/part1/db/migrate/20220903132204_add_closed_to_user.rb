class AddClosedToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :closed, :boolean
  end
end
