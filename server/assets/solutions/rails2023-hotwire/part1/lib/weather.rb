class Weather
  def self.current(city)
    url = "http://api.weatherstack.com/current?access_key=#{key}&query=#{ERB::Util.url_encode(city)}"
    puts url
    puts ENV.fetch('WEATHERSTACK_APIKEY')
    response = HTTParty.get url
    puts response.parsed_response
    OpenStruct.new response.parsed_response['current']
  end

  def self.key
    return nil if Rails.env.test?
    raise "WEATHERSTACK_APIKEY env variable not defined" if ENV['WEATHERSTACK_APIKEY'].nil?

    ENV.fetch('WEATHERSTACK_APIKEY')
  end
end
