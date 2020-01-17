class Lesson < ApplicationRecord
  belongs_to :user
  has_many :reviews, dependent: :destroy

  print "Hello"
end
