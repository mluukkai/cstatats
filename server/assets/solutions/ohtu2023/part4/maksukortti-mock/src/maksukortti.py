# ÄLÄ MUUTA TÄMÄN LUOKAN KOODIA
class Maksukortti:
    def __init__(self, saldo):
        self.saldo = saldo

    def lataa(self, maara):
        self.saldo = self.saldo + maara

    def osta(self, maara):
        self.saldo = self.saldo - maara
