class ReviewsController < ApplicationController
  def today
    @reviews = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Time.zone.now.to_date).includes(:lesson)
  end

  def reviewing
  end

  def reviewed_today
    @reviews = current_user.reviews.where("(done = ?) AND (done_date = ?)", true, Time.zone.now.to_date).includes(:lesson)
  end
end
