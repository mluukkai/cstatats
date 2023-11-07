from tuote import Tuote
from kirjanpito import kirjanpito as default_kirjanpito


class Varasto:
    def __init__(self, kirjanpito=default_kirjanpito):
        self._kirjanpito = kirjanpito
        self._saldot = {}
        self._alusta_tuotteet()

    def hae_tuote(self, id):
        tuotteet = self._saldot.keys()

        for tuote in tuotteet:
            if tuote.id == id:
                return tuote

        return None

    def saldo(self, id):
        tuote = self.hae_tuote(id)

        return self._saldot[tuote]

    def ota_varastosta(self, tuote):
        saldo = self.saldo(tuote.id)

        self._saldot[tuote] = saldo - 1

        self._kirjanpito.lisaa_tapahtuma(f"otettiin varastosta {tuote}")

    def palauta_varastoon(self, tuote):
        saldo = self.saldo(tuote.id)

        self._saldot[tuote] = saldo + 1

        self._kirjanpito.lisaa_tapahtuma(f"palautettiin varastoon {tuote}")

    def _alusta_tuotteet(self):
        self._saldot[Tuote(1, "Koff Portteri", 3)] = 100
        self._saldot[Tuote(2, "Fink Bräu I", 1)] = 25
        self._saldot[Tuote(3, "Sierra Nevada Pale Ale", 5)] = 30
        self._saldot[Tuote(4, "Mikkeller not just another Wit", 7)] = 40
        self._saldot[Tuote(5, "Weihenstephaner Hefeweisse", 4)] = 15


varasto = Varasto()
