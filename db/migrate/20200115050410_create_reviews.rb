class CreateReviews < ActiveRecord::Migration[5.2]
  def change
    create_table :reviews do |t|
      t.references :user, foreign_key: true
      t.references :lesson, foreign_key: true
      t.date :date, null: false
      t.integer :count, null: false
      t.integer :correctness, :default: 0
      t.boolean :done, default: false, null: false
      t.date :done_date 
      t.timestamps
    end
  end
end
