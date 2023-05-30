from player import Player
from player_reader import PlayerReader
from player import Player

class Statistics:
    def __init__(self, reader: PlayerReader):
        self.players =  [Player(player_dict) for player_dict in reader.fetch()]

    def top_scorers_by_nationality(self, nationality):
        def by_points(p: Player):
            return (p.goals + p.assists, p.goals)
        return sorted([p for p in self.players if p.nationality == nationality], key=by_points, reverse=True)
