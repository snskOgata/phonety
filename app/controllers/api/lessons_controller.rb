class Api::LessonsController < ApplicationController
  def create
    # 同センテンスを既に学習済みであればそれを取得、なければ新しく作成する
    if lesson = Lesson.find_or_initialize_by(user_id: current_user.id, content: params[:content])
      if lesson.persisted?
        # 既に存在していればアップデート
        lesson.update(lesson_params)
      else
        # 新規ならば登録
        if lesson = Lesson.create(lesson_params)
          #　レッスンを保存できたら復習を追加していく
          today = Date.today
          dates_since = [1, 3, 7, 14, 21, 28]
          (0..5).each do |i|
            Review.create(user_id: current_user.id, lesson_id: lesson.id, count: (i + 1), date: (today + dates_since[i]))
          end
        else
          flash.now("保存に失敗しました")
        end
      end

      # 学習履歴のカウントアップ
      if record = StudyRecord.find_or_initialize_by(user_id: current_user.id, date: Date.today)
        # レコードが既に存在していたらカウントアップ、なければ追加
        if record.persisted?
          record.update(count: (record.count+1))
        else
          record.save
        end
      end
      # ユーザの学習カウントを追加
      User.find_by(id: current_user.id).update(study_count: (current_user.study_count + 1))

    else
      flash.now("保存に失敗しました")
    end

  end

  private
    def lesson_params
      params.permit(:content, :correctness).merge(user_id: current_user.id)
    end
end