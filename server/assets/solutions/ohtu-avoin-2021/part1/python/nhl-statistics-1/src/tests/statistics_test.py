import unittest
from statistics import Statistics
from player import Player

class PlayerReaderStub:
    def get_players(self):
        return [
            Player("Semenko", "EDM", 4, 12),
            Player("Lemieux", "PIT", 45, 54),
            Player("Kurri",   "EDM", 37, 53),
            Player("Yzerman", "DET", 42, 56),
            Player("Gretzky", "EDM", 35, 89)
        ]

class TestStatistics(unittest.TestCase):
    def setUp(self):
        # annetaan Statistics-luokan oliolle "stub"-luokan olio
        self.statistics = Statistics(PlayerReaderStub())

    def test_searching_player(self):
        player = self.statistics.search("Lemieux")
        self.assertEqual("PIT", player.team)
        self.assertEqual(45, player.goals)

    def test_searching_non_existing_player(self):
        player = self.statistics.search("Jokinen")
        self.assertEqual(None, player)

    def test_searching_team(self):
        team = self.statistics.team("EDM")
        self.assertEqual(3, len(team))
        names = ["Gretzky","Kurri", "Semenko"]
        self.assertEqual(names, sorted(p.name for p in team))

    def test_stop_n(self):
        players = self.statistics.top_scorers(3)
        self.assertEqual(3, len(players))
        self.assertEqual("Gretzky", players[0].name)
        self.assertEqual("Lemieux", players[1].name)
        self.assertEqual("Yzerman", players[2].name)