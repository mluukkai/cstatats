class Player:
    def __init__(self, player_dict):
        self.name = player_dict['name']
        self.nationality = player_dict['nationality']
        self.goals = player_dict['goals']
        self.assists = player_dict['assists']
        self.team = player_dict['team']
    
    def __str__(self):
        points = self.goals + self.assists
        return f"{self.name:<20} {self.team} {self.goals:>2} + {self.assists:>2} = {points:>2}"
