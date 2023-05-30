class Style < ApplicationRecord
  include RatingAverage
  has_many :beers
  has_many :ratings, through: :beers

  def self.top(amount)
    sorted_by_rating_in_desc_order = Brewery.all.sort_by{ |b| -(b.average_rating || 0) }
    sorted_by_rating_in_desc_order[0, amount]
  end
end
