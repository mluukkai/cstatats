class BeerClub < ApplicationRecord
  has_many :memberships, -> { where(confirmed: true) }, dependent: :destroy
  has_many :members, through: :memberships, source: :user

  has_many :applications, -> { where(confirmed: false) }, class_name: 'Membership'
  has_many :applicants, through: :applications, source: :user
end
