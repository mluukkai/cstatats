class Style < ApplicationRecord
  include RatingAverage
  extend TopRated

  has_many :beers
  has_many :ratings, through: :beers
end
