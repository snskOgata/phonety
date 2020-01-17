class Api::UsersController < ApplicationController
  def get_study_records
    @records = current_user.study_records
  end
end