class UsersController < ApplicationController
  def update_goal
    unless current_user.update(goal: params[:goal])
      flash.now[:alert] = "更新に失敗しました"
    end
  end
end
