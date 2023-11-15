from tennis_game import TennisGame


def main():
    game = TennisGame("player1", "player2")

    print(game.get_score())

    game.won_point("player1")
    print(game.get_score())

    game.won_point("player1")
    print(game.get_score())

    game.won_point("player2")
    print(game.get_score())

    game.won_point("player1")
    print(game.get_score())

    game.won_point("player1")
    print(game.get_score())


if __name__ == "__main__":
    main()
