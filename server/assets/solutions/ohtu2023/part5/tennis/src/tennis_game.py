as_text = {
    0: "Love",
    1: "Fifteen",
    2: "Thirty",
    3: "Forty"
}

class TennisGame:
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

    def tie(self):
        if self.m_score1 > 2:
            return "Deuce"
        
        return f"{as_text[self.m_score1]}-All" 

    def win_or_advantage(self):
        difference = self.m_score1 - self. m_score2
        better = "player1" if difference > 0 else "player2"

        if abs(difference) > 1: 
            return f"Win for {better}"

        return f"Advantage {better}"

    def lead_no_advantage(self):
        return f"{as_text[self.m_score1]}-{as_text[self.m_score2]}"


    def get_score(self):
        if self.m_score1 == self.m_score2:
            return self.tie()
        elif self.m_score1 >= 4 or self.m_score2 >= 4:
            return self.win_or_advantage()
        else:
            return self.lead_no_advantage()
