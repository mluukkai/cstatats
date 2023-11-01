from entities.user import User
import re

class UserInputError(Exception):
    pass


class AuthenticationError(Exception):
    pass


class UserService:
    def __init__(self, user_repository):
        self._user_repository = user_repository

    def check_credentials(self, username, password):
        if not username or not password:
            raise UserInputError("Username and password are required")

        user = self._user_repository.find_by_username(username)

        if not user or user.password != password:
            raise AuthenticationError("Invalid username or password")

        return user

    def create_user(self, username, password):
        self.validate(username, password)

        user = self._user_repository.create(
            User(username, password)
        )

        return user

    def validate(self, username, password):
        if not username or not password:
            raise UserInputError("Username and password are required")

        if len(username) < 3:
            raise UserInputError("Invalid username: should have length 3 or more")
        
        if not re.match("^[a-z]+$", username):
            raise UserInputError("Invalid username: should consists of only letters a to z")

        if len(password) < 8:
            raise UserInputError("Invalid password: should have length 8 or more")
        
        if re.match("^([a-z]|[A-Z])+$", password):
            raise UserInputError("Invalid password: should not only contain letters")
