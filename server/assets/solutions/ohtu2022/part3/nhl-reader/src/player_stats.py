class PlayerStats:
    def __init__(self, reader):
        self._players = reader.players()

    def top_scorers_by_nationality(self, nationality):
        players = [
            player for player in self._players if player.nationality == nationality]
        players.sort(key=lambda p: -p.points())
        return players
