class Api::LessonsController < ApplicationController
  def create
    if lesson = Lesson.find_or_initialize_by(user_id: current_user.id, content: params[:content])
      if lesson.persisted?
        # 既に存在していればアップデート
        lesson.update(lesson_params)
      else
        # 新規ならば登録
        if lesson = Lesson.create(lesson_params)
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