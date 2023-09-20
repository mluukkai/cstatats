Rails.application.routes.draw do
  get 'calculator', to: 'misc#calculator'
  resources :messages
  resources :styles do
    get 'about', on: :collection
  end
  resources :memberships do
    post 'confirm', on: :member
  end
  resources :beer_clubs
  resources :users  do
    post 'toggle_closed', on: :member
    get 'recommendation', on: :member
  end
  resources :beers
  resources :breweries do
    post 'toggle_activity', on: :member
    get 'active', on: :collection 
    get 'retired', on: :collection 
  end
  resources :ratings, only: [:index, :show, :new, :create]
  delete 'ratings', to: 'ratings#destroy'

  resource :session, only: [:new, :create, :destroy]

  get 'signup', to: 'users#new'
  get 'signin', to: 'sessions#new'
  delete 'signout', to: 'sessions#destroy'

  resources :places, only: [:index, :show]
  post 'places', to:'places#search'

  get 'beerlist', to: 'beers#list'
  get 'brewerylist', to: 'breweries#list'
  
  root 'breweries#index'
end
