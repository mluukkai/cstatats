KAPASITEETTI = 5
OLETUSKASVATUS = 5


class IntJoukko:
    def __init__(self, kapasiteetti=None, kasvatuskoko=None):
        if kapasiteetti is None:
            self.kapasiteetti = KAPASITEETTI
        elif not isinstance(kapasiteetti, int) or kapasiteetti < 0:
            raise Exception("Väärä kapasiteetti")
        else:
            self.kapasiteetti = kapasiteetti

        if kasvatuskoko is None:
            self.kasvatuskoko = OLETUSKASVATUS
        elif not isinstance(kapasiteetti, int) or kapasiteetti < 0:
            raise Exception("kapasiteetti2")
        else:
            self.kasvatuskoko = kasvatuskoko

        self.lukujono = [0] * self.kapasiteetti

        self.alkioiden_lkm = 0

    def _varaa_lisaa_tilaa(self):
        vanha_lukujono = self.lukujono
        self.lukujono = [0] * (self.alkioiden_lkm + self.kasvatuskoko)
        self.kopioi_taulukko(vanha_lukujono, self.lukujono)

    def _alkion_paikka(self, n):
        for i in range(0, self.alkioiden_lkm):
            if n == self.lukujono[i]:
                return i

        return -1

    def kuuluu(self, n):
        return self._alkion_paikka(n) != -1

    def lisaa(self, n):
        if self.kuuluu(n):
            return False

        self.lukujono[self.alkioiden_lkm] = n
        self.alkioiden_lkm = self.alkioiden_lkm + 1

        if self.alkioiden_lkm == len(self.lukujono):
            self._varaa_lisaa_tilaa()

        return True

    def poista(self, n):
        kohta = self._alkion_paikka(n)

        if kohta == -1:
            return False

        for i in range(kohta, self.alkioiden_lkm - 1):
            self.lukujono[i] = self.lukujono[i + 1]

        self.alkioiden_lkm = self.alkioiden_lkm - 1
        return True

    def kopioi_taulukko(self, a, b):
        for i in range(0, len(a)):
            b[i] = a[i]

    def mahtavuus(self):
        return self.alkioiden_lkm

    def to_int_list(self):
        return [self.lukujono[i] for i in range(0, self.alkioiden_lkm)]

    @staticmethod
    def yhdiste(a, b):
        tulos = IntJoukko()

        for alkio in a.to_int_list():
            tulos.lisaa(alkio)

        for alkio in b.to_int_list():
            tulos.lisaa(alkio)

        return tulos

    @staticmethod
    def leikkaus(a, b):
        tulos = IntJoukko()

        for alkio in a.to_int_list():
            if b.kuuluu(alkio):
                tulos.lisaa(alkio)

        return tulos

    @staticmethod
    def erotus(a, b):
        tulos = IntJoukko()

        for alkio in a.to_int_list():
            if not b.kuuluu(alkio):
                tulos.lisaa(alkio)

        return tulos

    def __str__(self):
        if self.alkioiden_lkm == 0:
            return "{}"

        return "{" + ", ".join(str(luku) for luku in self.to_int_list()) + "}"
