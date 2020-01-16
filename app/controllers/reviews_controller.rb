class ReviewsController < ApplicationController
  def today
    @reviews = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Date.today).includes(:lesson)
  end
end
