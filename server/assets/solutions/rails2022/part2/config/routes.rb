Rails.application.routes.draw do
  resources :beers
  resources :breweries

  resources :ratings, only: [:index, :new, :create, :destroy]

  root 'breweries#index'
end
