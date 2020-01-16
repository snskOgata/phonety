class LessonsController < ApplicationController
  def new
  end

  def today
    @lessons = current_user.lessons.where(created_at: Time.zone.now.all_day)
  end
end
