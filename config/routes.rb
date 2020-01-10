Rails.application.routes.draw do
  root to: 'static_pages#home'
  namespace :api do
    resources :compares, only: :create
  end
end
