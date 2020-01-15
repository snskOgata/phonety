class CreateLessons < ActiveRecord::Migration[5.2]
  def change
    create_table :lessons do |t|
      t.references :use, foreign_key: true
      t.text :content, null: false, index: true, unique: true
      t.integer :correctness, default: 0
      t.boolean :done, default: false, null: false
      t.date :done_at
      t.timestamps
    end
  end
end
