class User < ApplicationRecord
  include RatingAverage

  has_secure_password

  has_many :ratings, dependent: :destroy
  has_many :beers, through: :ratings

  has_many :memberships, dependent: :destroy
  has_many :beer_clubs, through: :memberships

  validates :username, uniqueness: true,
                       length: { minimum: 3, maximum: 30 }

  validates :password, length: { minimum: 4 },
                       format: { with: /\A[A-Z].*\d|\d.*[A-Z]\z/, message: "must include one upper case letter and number" }

  def favorite_beer
    return nil if ratings.empty?

    ratings.order(score: :desc).limit(1).first.beer
  end

  def favorite_by(my_ratings, criteria)
    by_criteria = my_ratings
                  .group_by { |rating| rating.beer.send(criteria) }
                  .map { |key, val| [key, val.sum(&:score) / val.size] }

    by_criteria.max_by(&:last).first
  end

  def favorite_style
    return nil if ratings.empty?

    favorite_by(ratings, :style)
  end

  def favorite_brewery
    return nil if ratings.empty?

    favorite_by(ratings, :brewery)
  end

  def self.top(amount)
    sorted_by_rating_in_desc_order = User.all.sort_by{ |u| -u.ratings.count }
    sorted_by_rating_in_desc_order[0, amount]
  end
end
