require 'rails_helper'

include Helpers

describe "User" do
  before :each do
    FactoryBot.create :user
  end

  describe "who has signed up" do
    it "can signin with right credentials" do
      sign_in(username: "Pekka", password: "Foobar1")

      expect(page).to have_content 'Welcome back!'
      expect(page).to have_content 'Pekka'
    end

    it "is redirected back to signin form if wrong credentials given" do
      visit signin_path
      sign_in(username: "Pekka", password: "wrong")

      expect(current_path).to eq(signin_path)
      expect(page).to have_content 'Username and/or password mismatch'
    end    

    it "when signed up with good credentials, is added to the system" do
      visit signup_path
      fill_in('user_username', with: 'Brian')
      fill_in('user_password', with: 'Secret55')
      fill_in('user_password_confirmation', with: 'Secret55')
    
      expect{
        click_button('Create User')
      }.to change{User.count}.by(1)
    end
  end

  describe "when multiple ratings" do
    before :each do
      @user = User.first
      create_beers_with_many_ratings({ user: @user, style: "Lager" }, 12, 19, 14)
    end

    it "those are listed in user page" do
      visit user_path(@user)
      expect(page).to have_content 'Has made 3 ratings with an average of 15'
      expect(page).to have_content 'Favorite brewery anonymous'
      expect(page).to have_content 'Favorite style Lager'
      expect(page).to have_content '12 anonymous'
      expect(page).to have_content '19 anonymous'
      expect(page).to have_content '14 anonymous'
    end

    describe "when signed in" do
      before :each do
        sign_in(username: "Pekka", password: "Foobar1")
      end
    
      it "ratings can be deleted" do
        expect{
          page.first(:button, "delete").click
        }.to change{Rating.count}.by(-1)
      end
    end    
  end  
end

# rspec spec/features/users_page_spec.rb

# save_and_open_page