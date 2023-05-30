from tuote import Tuote
from ostos import Ostos
from functools import reduce

class Ostoskori:
    def __init__(self):
        self._ostokset = []

    def tavaroita_korissa(self):
        return reduce(lambda summa, ostos: summa + ostos.lukumaara(), self._ostokset, 0)

    def hinta(self):
        return reduce(lambda summa, ostos: summa + ostos.hinta(), self._ostokset, 0)

    def _etsi_ostos(self, tuote: Tuote):
        for ostos in self._ostokset:
            if ostos.tuotteen_nimi() == tuote.nimi():
                return ostos
  
        return None

        # voisimme tehdä saman "tyylikkäämmin" funktiolla next joka etsii ensimmäisen ehdon täyttävän:
        # return next((o for o in self._ostokset if o.tuotteen_nimi() == tuote.nimi()), None)   

    def lisaa_tuote(self, lisattava: Tuote):
        ostos: Ostos = self._etsi_ostos(lisattava)
        if ostos:
            ostos.muuta_lukumaaraa(1)
        else: 
            self._ostokset.append(Ostos(lisattava))

    def poista_tuote(self, poistettava: Tuote):
        ostos: Ostos = self._etsi_ostos(poistettava)
        if not ostos:
            return 
        
        ostos.muuta_lukumaaraa(-1)
        
        if ostos.lukumaara() == 0:
            self._ostokset = [o for o in self._ostokset if not o.tuotteen_nimi() == poistettava.nimi()]

    def tyhjenna(self):
        self._ostokset = []

    def ostokset(self):
        return self._ostokset