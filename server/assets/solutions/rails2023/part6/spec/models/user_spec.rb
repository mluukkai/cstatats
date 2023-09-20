require 'rails_helper'
include Helpers

RSpec.describe User, type: :model do
  it "has the username set correctly" do
    user = User.new username: "Pekka"

    expect(user.username).to eq("Pekka")
  end

  it "is not saved without a password" do
    user = User.create username: "Pekka"

    expect(user).not_to be_valid
    expect(User.count).to eq(0)
  end
  
  it "is saved with a proper password" do
    user = User.create username: "Pekka", password: "Secret1", password_confirmation: "Secret1"
  
    expect(user).to be_valid
    expect(User.count).to eq(1)
  end

  it "is not saved with too short password" do
    user = User.create username: "Pekka", password: "sec", password_confirmation: "sec"
  
    expect(user).not_to be_valid
    expect(User.count).to eq(0)
  end

  it "is not saved with invalid password" do
    user = User.create username: "Pekka", password: "secret", password_confirmation: "secret"
  
    expect(user).not_to be_valid
    expect(User.count).to eq(0)
  end

  describe "with a proper password" do
    let(:user) { FactoryBot.create(:user) }
  
    it "is saved" do
      expect(user).to be_valid
      expect(User.count).to eq(1)
    end
  
    it "and with two ratings, has the correct average rating" do
      FactoryBot.create(:rating, score: 10, user: user)
      FactoryBot.create(:rating, score: 20, user: user)
  
      expect(user.ratings.count).to eq(2)
      expect(user.average_rating).to eq(15.0)
    end
  end

  describe "favorite beer" do
    let(:user){ FactoryBot.create(:user) }
    let(:lager){ FactoryBot.create(:style) }
    let(:pils){ FactoryBot.create(:style, name: 'Pils') }

    it "has method for determining one" do
      expect(user).to respond_to(:favorite_beer)
    end
  
    it "without ratings does not have one" do
      expect(user.favorite_beer).to eq(nil)
    end

    it "is the only rated if only one rating" do
      beer = FactoryBot.create(:beer)
      FactoryBot.create(:rating, score: 20, beer: beer, user: user)
    
      expect(user.favorite_beer).to eq(beer)
    end

    it "is the one with highest rating if several rated" do
      create_beers_with_many_ratings({ user: user, style: lager }, 10, 20, 15, 7, 9)
      best = create_beer_with_rating({ user: user, style: lager }, 25 )
    
      expect(user.favorite_beer).to eq(best)
    end
  end

  describe "favorite style" do
    let(:user){ FactoryBot.create(:user) }
    let(:lager){ FactoryBot.create(:style) }
    let(:pils){ FactoryBot.create(:style, name: 'Pils') }
  
    it "has method for determining one" do
      expect(user).to respond_to(:favorite_style)
    end
  
    it "without ratings does not have one" do
      expect(user.favorite_style).to eq(nil)
    end

    it "is the only rated if only one rating" do
      beer = FactoryBot.create(:beer, style: pils)
      FactoryBot.create(:rating, score: 20, beer: beer, user: user)
    
      expect(user.favorite_style).to eq(beer.style)
    end
    
    it "is the one with highest rating if several rated" do
      create_beers_with_many_ratings({ user: user, style: lager }, 10, 20, 15, 7, 9)
      best = create_beer_with_rating({ user: user, style: pils }, 25 )
    
      expect(user.favorite_style).to eq(best.style)
    end  
  end

  describe "favorite brewery" do
    let(:user){ FactoryBot.create(:user) }
    let(:lager){ FactoryBot.create(:style) }
    let(:pils){ FactoryBot.create(:style, name: 'Pils') }

    it "has method for determining one" do
      expect(user).to respond_to(:favorite_brewery)
    end
  
    it "without ratings does not have one" do
      expect(user.favorite_brewery).to eq(nil)
    end

    it "is the only rated if only one rating" do
      beer = FactoryBot.create(:beer, style: pils)
      FactoryBot.create(:rating, score: 20, beer: beer, user: user)
    
      expect(user.favorite_brewery).to eq(beer.brewery)
    end
    
    it "is the one with highest rating if several rated" do
      create_beers_with_many_ratings({ user: user, style: lager }, 10, 20, 15, 7, 9)
      best = create_beer_with_rating({ user: user, style: pils }, 25 )
    
      expect(user.favorite_brewery).to eq(best.brewery)
    end  
  end

end