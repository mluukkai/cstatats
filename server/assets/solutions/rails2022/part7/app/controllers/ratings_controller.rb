class RatingsController < ApplicationController
  before_action :expire_brewery_cache, only: [:create]

  def index
    object = Rails.cache.read('rating_stats') || {}
    @recent = object[:recent]       || Rating.recent
    @breweries = object[:breweries] || Brewery.top(3)
    @beers = object[:beers]         || Beer.top(3)
    @styles = object[:styles]       || Style.top(3)
    @users = object[:users]         || User.top(3)
    @ratings = object[:ratings]     || Rating.all
  end

  def new
    @rating = Rating.new
    @beers = Beer.all
  end

  def create
    @rating = Rating.new params.require(:rating).permit(:score, :beer_id)
    @rating.user = current_user

    if @rating.save
      redirect_to beer_path(@rating.beer), notice: "Rating given"
    else
      @beers = Beer.all
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    rating = Rating.find(params[:id])
    rating.delete if current_user == rating.user
    redirect_to user_path rating.user
  end
end
