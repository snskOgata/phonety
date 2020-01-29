class Lesson < ApplicationRecord
  belongs_to :user
  has_many :reviews, dependent: :destroy

  default_scope -> { order(created_at: :desc) }
  
  validates :content, presence: true
end
