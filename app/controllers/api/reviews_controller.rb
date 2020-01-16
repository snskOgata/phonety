class Api::ReviewsController < ApplicationController

  def get_list_today
    @reviews = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Date.today).includes(:lesson)
  end

  def done
    puts
    puts "Done!!!"
    puts
  end

end