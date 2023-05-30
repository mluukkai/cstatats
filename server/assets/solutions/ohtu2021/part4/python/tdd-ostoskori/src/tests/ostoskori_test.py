import unittest
from ostoskori import Ostoskori
from tuote import Tuote
from ostos import Ostos

class TestOstoskori(unittest.TestCase):
    def setUp(self):
        self.kori = Ostoskori()
        self.maito = Tuote("Maito", 3)
        self.juusto = Tuote("Juusto", 5)

    # 1
    def test_ostoskorin_hinta_ja_tuotteiden_maara_alussa(self):
        self.assertEqual(self.kori.hinta(), 0)
        self.assertEqual(self.kori.tavaroita_korissa(), 0)

    # 2
    def test_yhden_tuotteen_lisaamisen_jalkeen_korissa_yksi_tavara(self):
        self.kori.lisaa_tuote(self.maito)

        self.assertEqual(self.kori.tavaroita_korissa(), 1)

    # 3
    def test_yhden_tuotteen_lisaamisen_jalkeen_korin_hinta_on_tuotteen_hinta(self):
        self.kori.lisaa_tuote(self.maito)
        
        self.assertEqual(self.kori.hinta(), 3)

    # 4
    def test_kahden_eri_tuotteen_lisaamisen_jalkeen_korissa_kaksi_tavara(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.juusto)

        self.assertEqual(self.kori.tavaroita_korissa(), 2)

    # 5
    def test_kahden_eri_tuotteen_lisaamisen_jalkeen_korin_hinta_on_hintojen_summa(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.juusto)
        summa = self.maito.hinta() + self.juusto.hinta()

        self.assertEqual(self.kori.hinta(), summa)

    # 6
    def test_kahden_saman_tuotteen_lisaamisen_jalkeen_korissa_kaksi_tavara(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.maito)

        self.assertEqual(self.kori.tavaroita_korissa(), 2)

    # 7
    def test_kahden_saman_tuotteen_lisaamisen_jalkeen_korin_hinta_on_hintojen_summa(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.maito)
        summa = self.maito.hinta() * 2

        self.assertEqual(self.kori.hinta(), summa)

    # 8
    def test_yhden_tuotteen_lisaamisen_jalkeen_korissa_yksi_ostos(self):
        self.kori.lisaa_tuote(self.maito)
        ostokset = self.kori.ostokset()

        self.assertEqual(len(ostokset), 1)

    # 9
    def test_yhden_tuotteen_lisaamisen_jalkeen_korissa_yksi_ostosolio_jolla_oikea_tuotteen_nimi_ja_maara(self):
        self.kori.lisaa_tuote(self.maito)
        ostos: Ostos = self.kori.ostokset()[0]

        self.assertEqual(ostos.lukumaara(), 1)
        self.assertEqual(ostos.tuotteen_nimi(), self.maito.nimi())
 
    # 10
    def test_kahden_eri_tuotteen_lisaamisen_jalkeen_korissa_kaksi_ostosta(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.juusto)
        ostokset = self.kori.ostokset()

        self.assertEqual(len(ostokset), 2)

    # 11
    def test_kahden_saman_tuotteen_lisaamisen_jalkeen_korissa_yksi_ostos(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.maito)
        ostokset = self.kori.ostokset()

        self.assertEqual(len(ostokset), 1)

    # 12
    def test_kahden_saman_tuotteen_lisaamisen_jalkeen_korissa_yksi_ostos_jolla_oikea_nimi_ja_maara(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.maito)
        ostos: Ostos = self.kori.ostokset()[0]

        self.assertEqual(ostos.lukumaara(), 2)
        self.assertEqual(ostos.tuotteen_nimi(), self.maito.nimi())

    # 13
    def test_jos_kahdesta_lisatysta_toinen_poistetaan_on_ostoksessa_yksi_tuote(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.maito)
        self.kori.poista_tuote(self.maito)
        ostos: Ostos = self.kori.ostokset()[0]

        self.assertEqual(ostos.lukumaara(), 1)

    # 14
    def test_lisayksen_ja_poiston_jalkeen_kori_tyhja(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.poista_tuote(self.maito)
        ostokset = self.kori.ostokset()

        self.assertEqual(len(ostokset), 0)

    # 14
    def test_tyhjennyksen_jalkeen_kori_tyhja(self):
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.maito)
        self.kori.lisaa_tuote(self.juusto)
        self.kori.tyhjenna()
        ostokset = self.kori.ostokset()

        self.assertEqual(len(ostokset), 0)