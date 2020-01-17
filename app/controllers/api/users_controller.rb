class Api::UsersController < ApplicationController
  def get_study_records
    @records = []
    recs = current_user.study_records
    recs.each do |rec|
      date = rec.date.to_time.to_i
      @records <<  {date: date, count: rec.count}
    end
  end
end