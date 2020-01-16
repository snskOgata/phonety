class LessonsController < ApplicationController
  def new
  end

  def today
    @lessons = current_user.lessons.where(created_at: Time.zone.now.all_day)
  end

  def destroy
    if params[:user_id].to_i == current_user.id
      Lesson.find(params[:id]).destroy
      redirect_to today_user_lessons_path(user_id: current_user.id)
    end
  end
end
