class Api::ReviewsController < ApplicationController

  def today
    @reviews = Review.where("(user_id = ?) AND (date = ?)", params[:user_id], Time.zone.now.to_date).includes(:lesson)
  end

  def get_list_today
    @reviews = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Time.zone.now.to_date).includes(:lesson)
  end

  def done
    # それぞれの精度と、reviewの完了・完了日を更新
    review = Review.find(params[:review_id])
    lesson = Lesson.find(params[:lesson_id])
    review.update(correctness: params[:correctness], done: true, done_date: Time.zone.now.to_date)

    # 復習が最後まで終わった場合、lessonの完了・完了日も更新
    if review.count == 6
      lesson.update(correctness: params[:correctness], done: true, done_date: Time.zone.now.to_date)
    else
      lesson.update(correctness: params[:correctness])
    end

    # 学習履歴のカウントアップ
    if record = StudyRecord.find_or_initialize_by(user_id: current_user.id, date: Time.zone.now.to_date)
      # レコードが既に存在していたらカウントアップ、なければ追加
      if record.persisted?
        record.update(count: (record.count+1))
      else
        record.save
      end
    end
    # ユーザの学習カウントを追加
    User.find_by(id: current_user.id).update(study_count: (current_user.study_count+ 1))

  end
end