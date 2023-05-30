
from tekoaly_parannettu import TekoalyParannettu
from kps_tekoaly import KPSTekoaly


class KPSParempiTekoaly(KPSTekoaly):
    def __init__(self):
        super().__init__()
        self.tekoaly = TekoalyParannettu(5)

    def _laita_edellinen_siirto_muistiin(self, siirto):
        self.tekoaly.aseta_siirto(siirto)
