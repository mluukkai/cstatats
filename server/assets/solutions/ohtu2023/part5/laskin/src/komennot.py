class Komento:
    def __init__(self, sovelluslogiikka, lue_syote=None):
        self._sovelluslogiikka = sovelluslogiikka
        self._lue_syote = lue_syote

    def suorita(self):
        self._vanha_arvo = self._sovelluslogiikka.arvo()
        self.tee_operaatio()
    
    def kumoa(self):
        self._sovelluslogiikka.aseta_arvo(self._vanha_arvo)

class Summa(Komento):
    def tee_operaatio(self):
        syote = int(self._lue_syote())
        self._sovelluslogiikka.plus(syote)

class Erotus(Komento):
    def tee_operaatio(self):
        syote = int(self._lue_syote())
        self._sovelluslogiikka.miinus(syote)

class Nollaus(Komento):
    def tee_operaatio(self):
        self._sovelluslogiikka.nollaa()