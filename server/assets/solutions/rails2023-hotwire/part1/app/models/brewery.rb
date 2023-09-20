class Brewery < ApplicationRecord
  include RatingAverage
  extend TopRated

  validates :name, presence: true
  validates :year, numericality: { greater_than_or_equal_to: 1040,
                                   only_integer: true }
  validate :year_not_greater_than_this_year

  has_many :beers, dependent: :destroy
  has_many :ratings, through: :beers

  scope :active, -> { where active: true }
  scope :retired, -> { where active: [nil, false] }

  def year_not_greater_than_this_year
    errors.add(:year, "can't be greater than current year") if year > Time.now.year
  end

  after_create_commit do 
    status = active? ? "active" : "retired"
    count = active? ? Brewery.active.count : Brewery.retired.count 

    broadcast_append_to "breweries_index", partial: "breweries/brewery_row", target: "#{status}_brewery_rows"
    broadcast_replace_to "breweries_index", partial: "breweries/brewery_count", locals: { count: count, status: status }, target: "#{status}_brewery_count"
  end

  after_destroy do 
    status = active? ? "active" : "retired"
    count = active? ? Brewery.active.count : Brewery.retired.count 

    broadcast_remove_to "breweries_index", target: self
    broadcast_replace_to "breweries_index", partial: "breweries/brewery_count", locals: { count: count, status: status }, target: "#{status}_brewery_count"
  end
end
