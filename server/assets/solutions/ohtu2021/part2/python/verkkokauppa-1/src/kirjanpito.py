class Kirjanpito:
    def __init__(self):
        self.tapahtumat = []

    def lisaa_tapahtuma(self, tapahtuma):
        self.tapahtumat.append(tapahtuma)

kirjanpito = Kirjanpito()