# SSL_CERT_FILE=cert/localhost.crt FAKTORY_PROVIDER=FAKTORY_URL FAKTORY_URL=tcp+tls://:secret@localhost:7491 bundle exec faktory-worker -r ./app.rb

require 'connection_pool'
require 'faktory'
require 'securerandom'

num_jobs = (ENV['COUNT'] || 10).to_i

class DemoWorker
  include Faktory::Job

  def perform(*args)
    puts "sum: #{args.join('+')}=#{args.sum}"
    sleep 0.5
  end
end

Thread.new do
  while true do
    puts "==> Pushing #{num_jobs} new jobs to queue..."
    num_jobs.times { DemoWorker.perform_async(rand(1..25), rand(1..15), rand(1..25)) }
    sleep 10
  end
end
