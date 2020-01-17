class CreateStudyRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :study_records do |t|
      t.references :user, foreign_key: true
      t.date :date, null: false
      t.integer :count, default: 0, null: false
      t.timestamps
    end
  end
end
