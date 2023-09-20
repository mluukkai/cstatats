module TopRated
  puts "lol"
  def top(amount)
    sorted_by_rating_in_desc_order = all.sort_by{ |b| -(b.average_rating || 0) }
    sorted_by_rating_in_desc_order[0, amount]
  end
end
