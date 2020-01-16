class Api::ReviewsController < ApplicationController

  def get_list_today
    @reviews = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Date.today).includes(:lesson)
  end

  def done
    review = Review.find(params[:review_id])
    lesson = Lesson.find(params[:lesson_id])
    review.update(correctness: params[:correctness], done: true, done_date: Date.today)
    if review.count == 6
      lesson.update(correctness: params[:correctness], done: true, done_date: Date.today)
    else
      lesson.update(correctness: params[:correctness])
    end
  end

end