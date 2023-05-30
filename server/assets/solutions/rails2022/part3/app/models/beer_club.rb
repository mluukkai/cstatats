class BeerClub < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :members, through: :memberships, source: :user
end
