from statistics_service import StatisticsService, SortBy
from player_reader import PlayerReader

def main():
    reader = PlayerReader("https://studies.cs.helsinki.fi/nhlstats/2021-22/players.txt")
    stats = StatisticsService(reader)

    print("Top point getters:")
    for player in stats.top(10, SortBy.GOALS):
        print(player)

if __name__ == "__main__":
    main()
