from datetime import datetime
from player_reader import PlayerReader
from statistics import Statistics

def main():
    url = "https://nhlstatisticsforohtu.herokuapp.com/players"
    reader = PlayerReader(url)
    stats = Statistics(reader)
    players = stats.top_scorers_by_nationality("FIN")

    for player in players:
        print(player)

main()