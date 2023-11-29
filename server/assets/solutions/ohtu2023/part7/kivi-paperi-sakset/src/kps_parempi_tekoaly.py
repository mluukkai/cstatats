from tekoaly_parannettu import TekoalyParannettu
from kps_tekoaly import KPSTekoaly

class KPSParempiTekoaly(KPSTekoaly):
    def __init__(self):
        self._tekoaly = TekoalyParannettu(10)

    def _kasittele_ensimmaisen_siirto(self, siirto):
        self._tekoaly.aseta_siirto(siirto)

