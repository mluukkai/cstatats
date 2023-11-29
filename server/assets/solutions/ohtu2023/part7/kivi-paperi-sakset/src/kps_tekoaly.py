from tekoaly import Tekoaly
from kivi_paperi_sakset import KiviPaperiSakset

class KPSTekoaly(KiviPaperiSakset):
    def __init__(self):
            self._tekoaly = Tekoaly()

    def _toisen_siirto(self):
        siirto = self._tekoaly.anna_siirto()
        print("tekoälyn siirto:", siirto)
        return siirto

