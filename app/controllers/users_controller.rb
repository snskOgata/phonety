class UsersController < ApplicationController
  
  def show
    @reviews = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Date.today)
  end

  def update_goal
    unless current_user.update(goal: params[:goal])
      flash.now[:alert] = "更新に失敗しました"
    end
  end
end
