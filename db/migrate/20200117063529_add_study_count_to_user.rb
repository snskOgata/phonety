class AddStudyCountToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :study_count, :integer
  end
end
