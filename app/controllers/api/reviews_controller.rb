class Api::ReviewsController < ApplicationController

  def get_list_today
    @reviews = current_user.reviews.where("(done = ?) AND (date <= ?)", false, Date.today).includes(:lesson)
  end

  def done
    # それぞれの精度と、reviewの完了・完了日を更新
    review = Review.find(params[:review_id])
    lesson = Lesson.find(params[:lesson_id])
    review.update(correctness: params[:correctness], done: true, done_date: Date.today)

    # 復習が最後まで終わった場合、lessonの完了・完了日も更新
    if review.count == 6
      lesson.update(correctness: params[:correctness], done: true, done_date: Date.today)
    else
      lesson.update(correctness: params[:correctness])
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

  end
end