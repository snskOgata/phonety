class ReviewsController < ApplicationController
  def today
    @reviews = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Date.today).includes(:lesson)
  end

  def reviewing
  end

  def reviewed_today
    @reviews = current_user.reviews.where("(done = ?) AND (done_date <= ?)", true, Date.today).includes(:lesson)
  end
end
