class AddNoteToLesson < ActiveRecord::Migration[5.2]
  def change
    add_column :lessons, :note, :text
  end
end
