KAPASITEETTI = 5
OLETUSKASVATUS = 5


class IntJoukko:
    def __init__(self, kapasiteetti=KAPASITEETTI, kasvatuskoko=OLETUSKASVATUS):
        if not isinstance(kapasiteetti, int) or kapasiteetti < 0:
            raise Exception("Väärä kapasiteetti") 
        if not isinstance(kapasiteetti, int) or kapasiteetti < 0:
            raise Exception("Väärä kapasiteetti")         
          
        self.kapasiteetti = kapasiteetti          
        self.kasvatuskoko = kasvatuskoko

        self.luvut = [0] * self.kapasiteetti
        self.alkioiden_lkm = 0

    def kuuluu(self, luku):
        return self.paikka(luku) > -1

    def paikka(self, luku):
        for i in range(self.alkioiden_lkm):
            if luku == self.luvut[i]:
                return i 

        return -1     

    def lisaa(self, luku):
        if self.kuuluu(luku):
          return False

        self.luvut[self.alkioiden_lkm] = luku
        self.alkioiden_lkm = self.alkioiden_lkm + 1

        if self.alkioiden_lkm == len(self.luvut):
            uusi = [0] * (self.alkioiden_lkm + self.kasvatuskoko)
            self.kopioi_taulukko(self.luvut, uusi)
            self.luvut = uusi

        return True   

    def poista(self, luku):
        kohta = self.paikka(luku) 
        if kohta == -1:
            return False

        for j in range(kohta, self.alkioiden_lkm - 1):
            self.luvut[j] = self.luvut[j + 1]

        self.alkioiden_lkm = self.alkioiden_lkm - 1
        return True

    def kopioi_taulukko(self, a, b):
        for i in range(0, len(a)):
            b[i] = a[i]

    def mahtavuus(self):
        return self.alkioiden_lkm

    def to_int_list(self):
        taulu = [0] * self.alkioiden_lkm

        for i in range(0, len(taulu)):
            taulu[i] = self.luvut[i]

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

        tuotos = "{"

        for i in range(0, self.alkioiden_lkm - 1):
            tuotos += f"{self.luvut[i]}, "

        tuotos += f"{self.luvut[self.alkioiden_lkm - 1]}"+"}"
        return tuotos
