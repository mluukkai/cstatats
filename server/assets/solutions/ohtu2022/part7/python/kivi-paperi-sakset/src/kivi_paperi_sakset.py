from tuomari import Tuomari


class KiviPaperiSakset:
    def __init__(self):
        self.tuomari = Tuomari()

    def ohje(self):
        return "Peli loppuu kun pelaaja antaa virheellisen siirron eli jonkun muun kuin k, p tai s"

    def hae_ensimmaisen_siirto(self):
        return input("Ensimmäisen pelaajan siirto: ")

    def hae_toisen_siirto(self):
        return input("Toisen pelaajan siirto: ")

    def pelaa(self):

        while True:
            ekan_siirto = self.hae_ensimmaisen_siirto()
            tokan_siirto = self.hae_toisen_siirto()

            if not self._onko_ok_siirto(ekan_siirto) or not self._onko_ok_siirto(tokan_siirto):
                break

            self.tuomari.kirjaa_siirto(ekan_siirto, tokan_siirto)
            self._laita_edellinen_siirto_muistiin(ekan_siirto)
            print(self.tuomari.tulos())

        print("Kiitos!")
        print(self.tuomari.tulos())

    # tämä metodi on parempaa tekoälyä varten, sen tulee muistaa ihmisen edellinen siirto
    def _laita_edellinen_siirto_muistiin(self, siirto):
        pass

    def _onko_ok_siirto(self, siirto):
        return siirto == "k" or siirto == "p" or siirto == "s"
