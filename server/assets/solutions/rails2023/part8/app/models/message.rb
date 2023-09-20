class Message < ApplicationRecord
  belongs_to :user

  after_create_commit do 
    puts "hello"
    broadcast_prepend_to "messages_index", partial: "messages/message", target: "messages"
  end
end
