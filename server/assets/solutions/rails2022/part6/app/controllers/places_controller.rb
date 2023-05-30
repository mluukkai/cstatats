class PlacesController < ApplicationController
  def index
  end

  def show
    places = BeermappingApi.places_in(session[:last_city])
    @place = places.find{ |p| p.id == params[:id] }
  end

  def search
    @city = params[:city].downcase
    @places = BeermappingApi.places_in(@city)
    @weather = Weather.current(@city)

    if @places.empty?
      redirect_to places_path, notice: "No locations in #{@city}"
    else
      session[:last_city] = @city
      render :index, status: 418
    end
  end
end
