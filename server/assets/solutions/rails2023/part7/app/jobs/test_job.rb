class TestJob
  include SuckerPunch::Job

  def perform
    sleep 1
    puts "starting job..."
    sleep 10
    puts "job ready!"
  end
end
