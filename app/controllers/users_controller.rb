class UsersController < ApplicationController
  
  def show
    @today_reviewing = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Time.zone.now.to_date)
    @today_reviewed = current_user.reviews.where("(done = ?) AND (done_date = ?)", true, Time.zone.now.to_date)
    @today_lessons = current_user.lessons.where(created_at: Time.zone.now.all_day)
  end

  def update_goal
    unless current_user.update(goal: params[:goal])
      flash.now[:alert] = "更新に失敗しました"
    end
  end
end
