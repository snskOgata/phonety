class Api::LessonsController < ApplicationController
  def create
    if lesson = Lesson.find_or_initialize_by(user_id: current_user.id, content: params[:content])
      if lesson.persisted?
        # 既に存在していればアップデート
        lesson.update(lesson_params)
      else
        # 新規ならば登録
        if lesson = Lesson.create(lesson_params)
          today = Date.today
          dates_since = [1, 3, 7, 14, 21, 28]
          (0..5).each do |i|
            Review.create(user_id: current_user.id, lesson_id: lesson.id, count: (i + 1), date: (today + dates_since[i]))
          end
        else
          flash.now("保存に失敗しました")
        end
      end
    else
      flash.now("保存に失敗しました")
    end
  end

  private
    def lesson_params
      params.permit(:content, :correctness).merge(user_id: current_user.id)
    end
end