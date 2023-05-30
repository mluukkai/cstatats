import requests
from player import Player


class PlayerReader:
    def __init__(self, url):
        response = requests.get(url).json()

        self._players = [Player(player_dict) for player_dict in response]

    def players(self):
        return self._players
