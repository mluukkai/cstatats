from statistics import Statistics, PlayerReader, SortBy


def main():
    url = "https://studies.cs.helsinki.fi//nhlstats/2021-22/players.txt"

    stats = Statistics(PlayerReader(url))
    philadelphia_flyers_players = stats.team("PHI")

    print("Philadelphia Flyers:")
    for player in philadelphia_flyers_players:
        print(player)

    print('--')

    print("Top point getters:")
    for player in stats.top(10):
        print(player)


if __name__ == "__main__":
    main()
