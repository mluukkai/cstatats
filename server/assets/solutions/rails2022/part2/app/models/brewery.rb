class Brewery < ApplicationRecord
  include RatingAverage

  has_many :beers, dependent: :destroy
  has_many :ratings, through: :beers
end
