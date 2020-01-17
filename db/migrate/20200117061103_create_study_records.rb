class CreateStudyRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :study_records do |t|

      t.timestamps
    end
  end
end
