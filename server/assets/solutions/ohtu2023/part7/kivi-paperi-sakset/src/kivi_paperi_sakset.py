from tuomari import Tuomari

class KiviPaperiSakset:
    def pelaa(self):
        tuomari = Tuomari()

        while True:
            ekan_siirto = self._ensimmaisen_siirto()
            tokan_siirto = self._toisen_siirto()    
            
            if not self._onko_ok_siirto(ekan_siirto) or not self._onko_ok_siirto(tokan_siirto):
              break

            tuomari.kirjaa_siirto(ekan_siirto, tokan_siirto)
            print(tuomari)

        print("Kiitos!")
        print(tuomari)

    def _onko_ok_siirto(self, siirto):
        return siirto == "k" or siirto == "p" or siirto == "s"
    
    def _ensimmaisen_siirto(self):
        siirto = input("Ensimmäisen pelaajan siirto: ")
        self._kasittele_ensimmaisen_siirto(siirto)
        return siirto

    def _toisen_siirto(self):
        return input("Toisen pelaajan siirto: ")
    
    def _kasittele_ensimmaisen_siirto(self, siirto):
        pass