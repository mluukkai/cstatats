class RatingsController < ApplicationController
  def index
    @recent = Rating.recent
    @breweries = Brewery.top(3)
    @beers = Beer.top(3)
    @styles = Style.top(3)
    @users = User.top(3)
  end

  def new
    @rating = Rating.new
    @beers = Beer.all
  end

  def create
    @rating = Rating.new params.require(:rating).permit(:score, :beer_id)
    @rating.user = current_user

    if @rating.save
      redirect_to user_path current_user
    else
      @beers = Beer.all
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    rating = Rating.find(params[:id])
    rating.delete if current_user == rating.user
    redirect_to ratings_path
  end
end
