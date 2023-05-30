from tekoaly import Tekoaly
from kivi_paperi_sakset import KiviPaperiSakset


class KPSTekoaly(KiviPaperiSakset):
    def __init__(self):
        super().__init__()
        self.tekoaly = Tekoaly()

    def hae_toisen_siirto(self):
        siirto = self.tekoaly.anna_siirto()
        print(self.tekoaly.nimi(), siirto)
        return siirto
