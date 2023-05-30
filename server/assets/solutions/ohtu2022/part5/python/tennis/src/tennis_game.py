class TennisGame:
    score_to_string = {
        0: 'Love',
        1: 'Fifteen',
        2: 'Thirty',
        3: 'Forty'
    }

    def __init__(self, player1_name, player2_name):
        self.player1_name = player1_name
        self.player2_name = player2_name
        self.m_score1 = 0
        self.m_score2 = 0

    def won_point(self, player_name):
        if player_name == "player1":
            self.m_score1 = self.m_score1 + 1
        else:
            self.m_score2 = self.m_score2 + 1

    def when_tied(self):
        if self.m_score1 < 4:
            return self.score_to_string[self.m_score1]+"-All"
        else:
            return "Deuce"

    def get_winner(self, minus_result):
        if minus_result > 0:
            return 1
        return 2

    def possible_win(self):
        minus_result = self.m_score1 - self. m_score2
        is_not_win = minus_result == 1 or minus_result == -1

        winner = self.get_winner(minus_result)

        if is_not_win:
            return f"Advantage player{winner}"
        else:
            return f"Win for player{winner}"

    def other_result(self):
        score1 = self.score_to_string[self.m_score1]
        score2 = self.score_to_string[self.m_score2]
        return f"{score1}-{score2}"

    def get_score(self):
        if self.m_score1 == self.m_score2:
            return self.when_tied()
        elif self.m_score1 >= 4 or self.m_score2 >= 4:
            return self.possible_win()
        else:
            return self.other_result()
