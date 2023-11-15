KAPASITEETTI = 5
OLETUSKASVATUS = 5


class IntJoukko:
    # tämä metodi on ainoa tapa luoda listoja
    def _luo_lista(self, koko):
        return [0] * koko

    def __init__(self, kapasiteetti=KAPASITEETTI, kasvatuskoko=OLETUSKASVATUS):
        if not isinstance(kapasiteetti, int) or kapasiteetti < 0:
            raise Exception("Väärä kapasiteetti")

        if not isinstance(kapasiteetti, int) or kapasiteetti < 0:
            raise Exception("Väärä kasvatuskoko") 
            
        self.kapasiteetti = kapasiteetti
        self.kasvatuskoko = kasvatuskoko

        self.joukon_luvut = self._luo_lista(self.kapasiteetti)

        self.alkioiden_lkm = 0

    def _paikka(self, luku):
        for i in range(0, self.alkioiden_lkm):
            if luku == self.joukon_luvut[i]:
                return i
        return -1

    def kuuluu(self, n):
        return self._paikka(n) != -1

    def lisaa(self, lisattava_luku):
        if self.kuuluu(lisattava_luku):
            return False
        
        # ei tilaa, luodaan uusi lista luvuille
        if self.alkioiden_lkm == self.kapasiteetti -1:
            taulukko_old = self.joukon_luvut
            self.kapasiteetti = self.alkioiden_lkm + self.kasvatuskoko
            self.joukon_luvut = self._luo_lista(self.kapasiteetti)
            self._kopioi_lista(taulukko_old, self.joukon_luvut)

        self.joukon_luvut[self.alkioiden_lkm] = lisattava_luku
        self.alkioiden_lkm = self.alkioiden_lkm + 1

        return True

    def poista(self, poistettava_luku):
        kohta = self._paikka(poistettava_luku)

        if kohta == -1:
            return False
        
        for j in range(kohta, self.alkioiden_lkm - 1):
            self.joukon_luvut[j] = self.joukon_luvut[j + 1]

        self.alkioiden_lkm = self.alkioiden_lkm - 1
        return True

    def _kopioi_lista(self, mista, minne):
        for i in range(0, self.alkioiden_lkm):
            minne[i] = mista[i]

    def mahtavuus(self):
        return self.alkioiden_lkm

    def to_int_list(self):
        taulu = self._luo_lista(self.alkioiden_lkm)
        self._kopioi_lista(self.joukon_luvut, taulu)    
        return taulu

    @staticmethod
    def yhdiste(a, b):
        tulos = IntJoukko()

        for luku in a.to_int_list():
            tulos.lisaa(luku)
        for luku in b.to_int_list():
            tulos.lisaa(luku)

        return tulos

    @staticmethod
    def leikkaus(a, b):
        tulos = IntJoukko()

        for luku in a.to_int_list():
            if b.kuuluu(luku):
                tulos.lisaa(luku)

        return tulos

    @staticmethod
    def erotus(a, b):
        tulos = IntJoukko()

        for luku in a.to_int_list():
            if not b.kuuluu(luku):
                tulos.lisaa(luku)
                
        return tulos

    def __str__(self):
        if self.alkioiden_lkm == 0:
            return "{}"

        tuotos = ""
        for i in range(0, self.alkioiden_lkm - 1):
            tuotos = tuotos + str(self.joukon_luvut[i])  + ", "
        tuotos = tuotos + str(self.joukon_luvut[self.alkioiden_lkm - 1])
        return "{"+ tuotos + "}"
