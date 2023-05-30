from tuomari import Tuomari
from tekoaly import Tekoaly
from tekoaly_parannettu import TekoalyParannettu

class KPS:
    def pelaa(self):
        tuomari = Tuomari()
        while True:
            ekan_siirto = self._pelaajan_1_siirto()
            tokan_siirto = self._pelaajan_2_siirto()
            if not self._onko_ok_siirto(ekan_siirto) or not self._onko_ok_siirto(tokan_siirto):
                break

            tuomari.kirjaa_siirto(ekan_siirto, tokan_siirto)
            print(tuomari)
            self.kirjaa_siirto(ekan_siirto)

        print("Kiitos!")
        print(tuomari)

    def _onko_ok_siirto(self, siirto):
        return siirto == "k" or siirto == "p" or siirto == "s"

    def _pelaajan_1_siirto(self):
        return input("Ensimmäisen pelaajan siirto: ")

    def _pelaajan_2_siirto(self):
        pass
    
    def kirjaa_siirto(self, siirto):
        pass

class KPSPelaajaVsPelaaja(KPS):
    def _pelaajan_2_siirto(self):
        return input("Toisen pelaajan siirto: ")

class KPSTekoaly(KPS):
    def __init__(self, tekoaly):
        self._tekoaly = tekoaly

    def _pelaajan_2_siirto(self):
        tokan_siirto  = self._tekoaly.anna_siirto()
        print(f"Tietokone valitsi: {tokan_siirto}")
        return tokan_siirto

    def kirjaa_siirto(self, siirto):
        self._tekoaly.aseta_siirto(siirto)

def kps_versio(v):
      if v == "a": 
        return KPSPelaajaVsPelaaja()
      if v == "b": 
        return KPSTekoaly(Tekoaly())
      if v == "c": 
        return KPSTekoaly(TekoalyParannettu(10))
