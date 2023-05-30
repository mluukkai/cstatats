class SessionsController < ApplicationController
  def new
    # renderöi kirjautumissivun
  end

  def create
    user = User.find_by username: params[:username]

    if user.nil? || !user.authenticate(params[:password])
      redirect_to signin_path, notice: "Username and/or password mismatch"
    elsif user.closed?
      redirect_to signin_path, notice: "account closed, please contact admin"
    else
      session[:user_id] = user.id
      redirect_to user_path(user), notice: "Welcome back!"
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to :root
  end
end
