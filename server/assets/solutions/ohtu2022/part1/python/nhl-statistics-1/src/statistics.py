from player_reader import PlayerReader
from enum import Enum


class SortBy(Enum):
    POINTS = 1
    GOALS = 2
    ASSISTS = 3


class Statistics:
    def __init__(self, reader):
        self._players = reader.get_players()

    def search(self, name):
        for player in self._players:
            if name in player.name:
                return player

        return None

    def team(self, team_name):
        players_of_team = filter(
            lambda player: player.team == team_name,
            self._players
        )

        return list(players_of_team)

    def top(self, how_many, by=SortBy.POINTS):
        sort_criteria = {
            SortBy.POINTS: lambda p: p.points,
            SortBy.GOALS: lambda p: p.goals,
            SortBy.ASSISTS: lambda p: p.assists
        }

        sorted_players = sorted(
            self._players,
            reverse=True,
            key=sort_criteria[by]
        )

        result = []
        i = 0
        while i < how_many:
            result.append(sorted_players[i])
            i += 1

        return result
