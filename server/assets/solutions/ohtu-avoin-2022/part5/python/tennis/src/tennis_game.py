class TennisGame:
    def __init__(self, player1_name, player2_name):
        self.player1_name = player1_name
        self.player2_name = player2_name
        self.score_1 = 0
        self.score_2 = 0

        self.numbers = {
          0: "Love",
          1: "Fifteen",
          2: "Thirty",
          3: "Forty"
        }

    def won_point(self, player_name):
        if player_name == "player1":
            self.score_1 = self.score_1 + 1
        else:
            self.score_2 = self.score_2 + 1

    def tie_score(self):
        if self.score_1 < 4:
            return  f"{self.numbers[self.score_1]}-All"
        else:
           return "Deuce"

    def possible_winning_score(self):
        difference = self.score_1 - self.score_2
        player = "player1" if difference > 0 else "player2"

        if abs(difference) == 1:
            return f"Advantage {player}"

        return f"Win for {player}"
      
    def not_decisive_score(self):
      return f"{self.numbers[self.score_1]}-{self.numbers[self.score_2]}"

    def get_score(self):
        if self.score_1 == self.score_2:
            return self.tie_score()
        elif self.score_1 >= 4 or self.score_2 >= 4:
            return self.possible_winning_score()
        else:
            return self.not_decisive_score()