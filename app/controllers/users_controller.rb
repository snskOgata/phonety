class UsersController < ApplicationController
  
  def show
    @today_reviewing = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Date.today)
    @today_reviewed = current_user.reviews.where("(done = ?) AND (done_date = ?)", true, Date.today)
  end

  def update_goal
    unless current_user.update(goal: params[:goal])
      flash.now[:alert] = "更新に失敗しました"
    end
  end
end
