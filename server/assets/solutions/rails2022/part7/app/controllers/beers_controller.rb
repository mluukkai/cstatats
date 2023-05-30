class BeersController < ApplicationController
  before_action :set_beer, only: %i[show edit update destroy]
  before_action :set_breweries_and_styles_for_template, only: [:new, :edit, :create]
  before_action :ensure_that_signed_in, except: [:index, :show, :list]
  before_action :expire_beer_cache, only: [:create, :update, :delete]
  before_action :expire_brewery_cache, only: [:create, :delete]

  # GET /beers or /beers.json
  def index
    @order = params[:order] || 'name'
    return if request.format.html? && fragment_exist?("beerlist-#{@order}")

    @beers = Beer.all

    @beers = case @order
             when "name" then @beers.sort_by(&:name)
             when "brewery" then @beers.sort_by { |b| b.brewery.name }
             when "style" then @beers.sort_by { |b| b.style.name }
             when "rating" then @beers.sort_by(&:average_rating).reverse
             end
  end

  def list
  end

  # GET /beers/1 or /beers/1.json
  def show
    @rating = Rating.new
    @rating.beer = @beer
  end

  # GET /beers/new
  def new
    @beer = Beer.new
  end

  # GET /beers/1/edit
  def edit
  end

  # POST /beers or /beers.json
  def create
    @beer = Beer.new(beer_params)

    respond_to do |format|
      if @beer.save
        format.html { redirect_to beers_path, notice: "Beer was successfully created." }
        format.json { render :show, status: :created, location: @beer }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @beer.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /beers/1 or /beers/1.json
  def update
    respond_to do |format|
      if @beer.update(beer_params)
        format.html { redirect_to beer_url(@beer), notice: "Beer was successfully updated." }
        format.json { render :show, status: :ok, location: @beer }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @beer.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /beers/1 or /beers/1.json
  def destroy
    @beer.destroy

    respond_to do |format|
      format.html { redirect_to beers_url, notice: "Beer was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def set_breweries_and_styles_for_template
    @breweries = Brewery.all
    @styles = Style.all
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_beer
    @beer = Beer.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def beer_params
    params.require(:beer).permit(:name, :style_id, :brewery_id)
  end

  def expire_beer_cache
    %w(beerlist-name beerlist-brewery beerlist-style).each{ |f| expire_fragment(f) }
  end
end
