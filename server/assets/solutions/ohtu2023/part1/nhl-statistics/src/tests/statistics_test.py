import unittest
from statistics_service import StatisticsService, SortBy
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

class TestStatisticsService(unittest.TestCase):
  def setUp(self):
      self.stats = StatisticsService(
          PlayerReaderStub()
      )

  def test_players_of_team(self):
      players = self.stats.team("PIT")
      self.assertEqual(1, len(players))
      player = players[0]
      self.assertEqual(player.name, "Lemieux")

  def test_player_search_found(self):
      player = self.stats.search("Kurri")
      self.assertEqual(player.name, "Kurri")

  def test_player_search_not_found(self):
      player = self.stats.search("Selänne")
      self.assertEqual(player, None)

  def test_top_default(self):
      players = self.stats.top(3)
      self.assertEqual(3, len(players))
      self.assertEqual(players[0].name, "Gretzky")
      self.assertEqual(players[1].name, "Lemieux")
      self.assertEqual(players[2].name, "Yzerman")

  def test_top_points(self):
      players = self.stats.top(3, SortBy.POINTS)
      self.assertEqual(players[0].name, "Gretzky")
      self.assertEqual(players[1].name, "Lemieux")
      self.assertEqual(players[2].name, "Yzerman")

  def test_top_goals(self):
      players = self.stats.top(3, SortBy.GOALS)
      self.assertEqual(players[0].name, "Lemieux")
      self.assertEqual(players[1].name, "Yzerman")
      self.assertEqual(players[2].name, "Kurri")

  def test_top_assists(self):
      players = self.stats.top(3, SortBy.ASSISTS)
      self.assertEqual(players[0].name, "Gretzky")
      self.assertEqual(players[1].name, "Yzerman")
      self.assertEqual(players[2].name, "Lemieux")