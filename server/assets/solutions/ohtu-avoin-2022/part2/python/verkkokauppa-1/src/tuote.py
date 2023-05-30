class Tuote:
    def __init__(self, id, nimi, hinta):
        self.id = id
        self.nimi = nimi
        self.hinta = hinta

    def __hash__(self):
        return hash(self.id)

    def __eq__(self, other):
        return self.id == other.id

    def __str__(self):
        return self.nimi
