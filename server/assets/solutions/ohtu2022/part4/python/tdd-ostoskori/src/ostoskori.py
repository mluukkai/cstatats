from tuote import Tuote
from ostos import Ostos


class Ostoskori:
    def __init__(self):
        self._ostokset = []

    def _hae_ostos(self, tuote):
        # etsii ensimmäisen kriteerin täyttävän olion listalta, palautta None jos ei löydy
        return next((o for o in self._ostokset if o.tuote.nimi() == tuote.nimi()), None)

    def tavaroita_korissa(self):
        return sum(map(lambda o: o.lukumaara(), self._ostokset))

    def hinta(self):
        return sum(map(lambda o: o.hinta(), self._ostokset))

    def lisaa_tuote(self, lisattava: Tuote):
        ostos = self._hae_ostos(lisattava)
        if ostos:
            ostos.muuta_lukumaaraa(1)
        else:
            self._ostokset.append(Ostos(lisattava))

    def poista_tuote(self, poistettava: Tuote):
        ostos = self._hae_ostos(poistettava)
        if ostos:
            ostos.muuta_lukumaaraa(-1)
        self._ostokset = [o for o in self._ostokset if o.lukumaara() > 0]

    def tyhjenna(self):
        self._ostokset = []

    def ostokset(self):
        return self._ostokset
