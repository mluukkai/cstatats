from tkinter import constants

class Komento:
    def __init__(self, syotekentta, tulos_var, sovelluslogiikka):
        self._syote_kentta = syotekentta
        self._tulos_var = tulos_var
        self._sovelluslogiikka = sovelluslogiikka

    def suorita(self):
        self._edellinen_arvo = int(self._tulos_var.get())
        try:
            arvo = int(self._syote_kentta.get())
            self._operaatio(arvo)
        except:
            self._operaatio(0)

        self._syote_kentta.delete(0, constants.END)
        self._tulos_var.set(self._sovelluslogiikka.tulos)   

    def kumoa(self):
        self._sovelluslogiikka.aseta_arvo(self._edellinen_arvo)
        self._tulos_var.set(self._sovelluslogiikka.tulos)
        

class Summa(Komento):
    def _operaatio(self, arvo):
        self._sovelluslogiikka.plus(arvo)

class Erotus(Komento):
    def _operaatio(self, arvo):
        self._sovelluslogiikka.miinus(arvo)

class Nollaus(Komento):
    def _operaatio(self, arvo):
        self._sovelluslogiikka.nollaa()