class RemoveOldStylesFromBeer < ActiveRecord::Migration[7.0]
  def change
    remove_column :beers, :old_style
  end
end
