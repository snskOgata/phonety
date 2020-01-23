json.array!(@reviews) do |review|
  json.done review.done
  json.content review.lesson.content
  json.note review.lesson.note
  json.learn_date review.created_at.strftime('%Y/%m/%d')
end