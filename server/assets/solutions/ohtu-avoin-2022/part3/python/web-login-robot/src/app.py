from flask import (
    Flask,
    render_template,
    redirect,
    url_for,
    request,
    flash
)

from repositories.user_repository import user_repository
from services.user_service import user_service

app = Flask(__name__)
app.secret_key = "MXRg2upmZGaSR~2nMaGmiwW0o.lg_w"


def redirect_to_login():
    return redirect(url_for("render_login"))


def redirect_to_welcome():
    return redirect(url_for("render_welcome"))


def redirect_to_register():
    return redirect(url_for("render_register"))


def redirect_to_ohtu():
    return redirect(url_for("render_ohtu"))


@app.route("/")
def render_home():
    return render_template("index.html")


@app.route("/welcome")
def render_welcome():
    return render_template("welcome.html")


@app.route("/ohtu")
def render_ohtu():
    return render_template("ohtu.html")


@app.route("/login", methods=["GET"])
def render_login():
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def handle_login():
    username = request.form.get("username")
    password = request.form.get("password")

    try:
        user_service.check_credentials(username, password)
        return redirect_to_ohtu()
    except Exception as error:
        flash(str(error))
        return redirect_to_login()


@app.route("/logout", methods=["POST"])
def logout():
    return redirect_to_login()


@app.route("/register", methods=["GET"])
def render_register():
    return render_template("register.html")


@app.route("/register", methods=["POST"])
def handle_register():
    username = request.form.get("username")
    password = request.form.get("password")
    password_confirmation = request.form.get("password_confirmation")

    try:
        user_service.create_user(username, password, password_confirmation)
        return redirect_to_welcome()
    except Exception as error:
        flash(str(error))
        return redirect_to_register()


# tämän avulla voi tarkastaa onko palvelin käynnissä
@app.route("/ping")
def ping():
    return "Pong"


# sovelluksen tilan alustaminen testejä varten
@app.route("/tests/reset", methods=["POST"])
def reset_tests():
    user_repository.delete_all()
    return "Reset"
