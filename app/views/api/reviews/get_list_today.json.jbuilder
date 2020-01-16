json.array!(@reviews) do |review|
  json.review_id review.id
  json.lesson_id review.lesson.id
  json.correctness review.lesson.correctness
  json.content review.lesson.content
end