class MembershipsController < ApplicationController
  before_action :set_membership, only: %i[show edit update destroy]
  before_action :set_beer_clubs, only: %i[new edit create]

  # GET /memberships or /memberships.json
  def index
    @memberships = Membership.all
  end

  # GET /memberships/1 or /memberships/1.json
  def show
  end

  # GET /memberships/new
  def new
    @membership = Membership.new
  end

  # GET /memberships/1/edit
  def edit
  end

  def confirm
    membership = Membership.find(params[:id])
    membership.confirmed = true
    membership.save

    redirect_to membership.beer_club, notice: "membership of #{membership.user.username} confirmed"
  end

  # POST /memberships or /memberships.json
  def create
    @membership = Membership.new(membership_params)
    @membership.user = current_user
    @membership.confirmed = false

    respond_to do |format|
      if @membership.save
        format.html { redirect_to beer_club_url(@membership.beer_club), notice: "Membership was successfully created." }
        format.json { render :show, status: :created, location: @membership }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @membership.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /memberships/1 or /memberships/1.json
  def update
    respond_to do |format|
      if @membership.update(membership_params)
        format.html { redirect_to membership_url(@membership), notice: "Membership was successfully updated." }
        format.json { render :show, status: :ok, location: @membership }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @membership.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /memberships/1 or /memberships/1.json
  def destroy
    @membership.destroy

    respond_to do |format|
      format.html { redirect_to user_path current_user, notice: "Membership has ended" }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_membership
    @membership = Membership.find(params[:id])
  end

  def set_beer_clubs
    memberships_of_current = current_user.memberships.map(&:beer_club)
    @beer_clubs = BeerClub.where.not(id: memberships_of_current)
  end

  # Only allow a list of trusted parameters through.
  def membership_params
    params.require(:membership).permit(:beer_club_id)
  end
end
