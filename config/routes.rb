Rails.application.routes.draw do
  devise_for :users
  root to: 'static_pages#home'
  
  resources :users, only: :show do
    patch 'update_goal', to: 'users#update_goal'
    get :review, to: "reviews#today"
    get :reviewing, to: "reviews#reviewing"
    resources :lessons, only: [:index, :new, :destroy] do
      get :today, on: :collection
    end
    
  end
  namespace :api do
    resources :compares, only: :create
    resources :lessons, only: :create

    scope :reviews do 
      get :get_list_today, to: "reviews#get_list_today", defaults: { format: 'json' }
    end
  end
end
