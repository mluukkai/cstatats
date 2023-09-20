class RatingsController < ApplicationController
  before_action :expire_brewery_cache, only: [:create]

  PAGE_SIZE = 5

  def index
    @order = params[:order] || 'desc'
    @page = params[:page]&.to_i || 1

    @last_page = (Rating.count / PAGE_SIZE).ceil
    offset = (@page - 1) * PAGE_SIZE

    object = Rails.cache.read('rating_stats') || {}
    @recent = object[:recent]       || Rating.recent
    @breweries = object[:breweries] || Brewery.top(3)
    @beers = object[:beers]         || Beer.top(3)
    @styles = object[:styles]       || Style.top(3)
    @users = object[:users]         || User.top(3)

    @ratings = Rating
      .order(created_at: @order.to_sym)
      .limit(PAGE_SIZE).offset(offset)
  end

  def new
    @rating = Rating.new
    @beers = Beer.all
  end

  def show
    @rating = Rating.find(params[:id])
    render partial: 'users/rating_details', locals: { rating: @rating } 
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
    destroy_ids = request.body.string.split(',')

    puts(destroy_ids)

    destroy_ids.each do |id|
      rating = Rating.find_by(id: id)
      rating.destroy if rating && current_user == rating.user
      rescue StandardError => e
        puts "Rating record has an error: #{e.message}"
    end
    @user = current_user
    respond_to do |format|
      format.html { render partial: '/users/ratings', status: :ok, user: @user }
    end
  end

end
