from statistics import Statistics
from player_reader import PlayerReader
from matchers import And, HasAtLeast, PlaysIn, HasFewerThan, Or, Not
from querybuilder import Querybuilder

def main():
    url = "https://nhlstatisticsforohtu.herokuapp.com/players.txt"
    reader = PlayerReader(url)
    stats = Statistics(reader)

    query = Querybuilder()

    m1 = (
      query
        .playsIn("PHI")
        .hasAtLeast(10, "assists")
        .hasFewerThan(5, "goals")
        .build()
    )

    m2 = (
      query
        .playsIn("EDM")
        .hasAtLeast(40, "points")
        .build()
    )

    matcher = (
      query
        .oneOf(m1, m2)
        .build()
    )

    matcher = (
      query
        .oneOf(
          query.playsIn("PHI")
              .hasAtLeast(10, "assists")
              .hasFewerThan(5, "goals")
              .build(),
          query.playsIn("EDM")
              .hasAtLeast(40, "points")
              .build()
        )
        .build()
    )

    for player in stats.matches(matcher):
        print(player)

if __name__ == "__main__":
    main()
