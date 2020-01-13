Rails.application.routes.draw do
  devise_for :users
  root to: 'static_pages#home'
  resources :users, only: :show do
    patch 'update_goal', to: 'users#update_goal'
  end
  namespace :api do
    resources :compares, only: :create
  end
end
