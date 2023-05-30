import unittest
from statistics import Statistics, SortBy
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
        self.statistics = Statistics(
            PlayerReaderStub()
        )

    def test_players_of_team(self):
        players = self.statistics.team("EDM")

        self.assertEqual(len(players), 3)

    def test_player_search_when_found(self):
        player = self.statistics.search("Gretzky")

        self.assertEqual(player.name, "Gretzky")
        self.assertEqual(player.points, 35+89)

    def test_player_search_when_not_found(self):
        player = self.statistics.search("Selänne")

        self.assertEqual(player, None)

    def test_top_scorers(self):
        players = self.statistics.top(3)

        self.assertEqual(len(players), 3)
        self.assertEqual(players[0].name, "Gretzky")
        self.assertEqual(players[1].name, "Lemieux")
        self.assertEqual(players[2].name, "Yzerman")

    def test_top_goal_scorers(self):
        players = self.statistics.top(3, SortBy.GOALS)

        self.assertEqual(len(players), 3)
        self.assertEqual(players[0].name, "Lemieux")
        self.assertEqual(players[1].name, "Yzerman")
        self.assertEqual(players[2].name, "Kurri")

    def test_top_assist_makers(self):
        players = self.statistics.top(3, SortBy.ASSISTS)

        self.assertEqual(len(players), 3)
        self.assertEqual(players[0].name, "Gretzky")
        self.assertEqual(players[1].name, "Yzerman")
        self.assertEqual(players[2].name, "Lemieux")
