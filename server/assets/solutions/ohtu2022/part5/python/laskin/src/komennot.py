from sovelluslogiikka import Sovelluslogiikka


class Komento:
    def __init__(self, sovellus: Sovelluslogiikka, lue_syote):
        self.sovellus = sovellus
        self.lue_syote = lue_syote

    def syote(self):
        try:
            return int(self.lue_syote())
        except:
            return 0

    def suorita(self):
        self.vanha_arvo = self.sovellus.tulos
        self.tee_komenoto()

    def kumoa(self):
        self.sovellus.aseta_arvo(self.vanha_arvo)


class Summa(Komento):
    def tee_komenoto(self):
        self.sovellus.plus(self.syote())


class Erotus(Komento):
    def tee_komenoto(self):
        self.sovellus.miinus(self.syote())


class Nollaus(Komento):
    def tee_komenoto(self):
        self.sovellus.nollaa()


class Kumoa:
    def __init__(self, sovellus, syote):
        pass

    def suorita(self):
        print('YE')
