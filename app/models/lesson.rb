class Lesson < ApplicationRecord
  belongs_to :user
  has_many :reviews, dependent: :destroy

  validates :content, presence: true
end
