class Player:
    def __init__(self, name, team, goals, assists):
        self.name = name
        self.team = team
        self.goals = goals
        self.assists = assists

    @property
    def points(self):
        return self.goals + self.assists
    
    def __str__(self):
        return f"{self.name:20} {self.team:12} {str(self.goals):2} + {str(self.assists):2} = {self.points}"
