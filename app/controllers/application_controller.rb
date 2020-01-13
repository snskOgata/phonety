class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?

  # 新規登録後、ユーザーページへ
  def after_sign_up_path_for(resource)
    "/users/#{current_user.id}"
  end
  # ログイン後、ユーザーページへ
  def after_sign_in_path_for(resource)
      "/users/#{current_user.id}"
  end

  protected
    def configure_permitted_parameters
    # サインアップ時にnameのストロングパラメータを追加
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :goal])
    # アカウント編集の時にnameとprofileのストロングパラメータを追加
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :goal])
    end
end
