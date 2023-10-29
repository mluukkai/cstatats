from player_reader import PlayerReader

def points(p):
    return -(p.goals + p.assists)


class PlayerStats:
    def __init__(self, reader):
        self.players = reader.get_players()

    def top_scorers_by_nationality(self, nationality):
        players = [p for p in self.players if p.nationality == nationality]

        players.sort(key=points)

        return players