Rails.application.routes.draw do
  devise_for :users
  root to: 'static_pages#home'
  namespace :api do
    resources :compares, only: :create
  end
end
