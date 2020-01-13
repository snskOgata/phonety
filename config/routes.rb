Rails.application.routes.draw do
  devise_for :users
  root to: 'static_pages#home'
  resources :users, only: :show
  namespace :api do
    resources :compares, only: :create
  end
end
