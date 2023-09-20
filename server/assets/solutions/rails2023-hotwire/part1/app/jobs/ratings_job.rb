class RatingsJob
  include SuckerPunch::Job

  def perform
    object = {
      recent: Rating.recent,
      breweries: Brewery.top(3),
      beers: Beer.top(3),
      styles: Style.top(3),
      users: User.top(3),
      ratings: Rating.all
    }

    Rails.cache.write 'rating_stats', object

    # RatingsJob.perform_in(24.hours)
  end
end
