class LessonsController < ApplicationController

  def index
    @lessons = current_user.lessons
  end

  def new
  end

  def show
    @lesson = Lesson.find_by(id: params[:id], user_id: current_user.id)
  end

  def today
    @lessons = current_user.lessons.where(created_at: Time.zone.now.all_day)
  end

  def update
    Lesson.find_by(id: params[:id], user_id: current_user.id).update(lesson_params)
  end

  def destroy
    if params[:user_id].to_i == current_user.id
      Lesson.find(params[:id]).destroy
      redirect_to today_user_lessons_path(user_id: current_user.id)
    end
  end

  private
    def lesson_params
      params.permit(:content, :correctness, :note)
    end

end
