class Review < ApplicationRecord
  belongs_to :user
  belongs_to :lesson

  default_scope -> { order(date: :asc) }
end
