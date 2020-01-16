Rails.application.routes.draw do
  devise_for :users
  root to: 'static_pages#home'
  
  resources :users, only: :show do
    patch 'update_goal', to: 'users#update_goal'
    resources :lessons, only: :new do
      get :today, on: :collection
    end
  end
  namespace :api do
    resources :compares, only: :create
    resources :lessons, only: :create
  end
end
