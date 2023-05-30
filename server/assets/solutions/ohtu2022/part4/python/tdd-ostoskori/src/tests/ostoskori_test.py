import unittest
from ostoskori import Ostoskori
from tuote import Tuote


class TestOstoskori(unittest.TestCase):
    def setUp(self):
        self.kori = Ostoskori()
        self.tuote_1 = Tuote("Maito", 3)
        self.tuote_2 = Tuote("Juusto", 2)

    def test_ostoskorin_hinta_ja_tavaroiden_maara_alussa(self):
        self.assertEqual(self.kori.hinta(), 0)
        self.assertEqual(self.kori.tavaroita_korissa(), 0)

    def test_yhden_tuotteen_lisaamisen_jalkeen_korissa_yksi_tavara(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.assertEqual(self.kori.tavaroita_korissa(), 1)

    def test_yhden_tuotteen_lisaamisen_jalkeen_korin_hinta_oikea(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.assertEqual(self.kori.hinta(), self.tuote_1.hinta())

    def test_kahden_eri_tuotteen_lisaamisen_jalkeen_korissa_yksi_tavara(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.lisaa_tuote(self.tuote_2)
        self.assertEqual(self.kori.tavaroita_korissa(), 2)

    def test_kahden_eri_tuotteen_lisaamisen_jalkeen_korin_hinta_oikea(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.lisaa_tuote(self.tuote_2)
        self.assertEqual(self.kori.hinta(),
                         self.tuote_1.hinta() + self.tuote_2.hinta())

    def test_kahden_saman_tuotteen_lisaamisen_jalkeen_korissa_yksi_tavara(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.lisaa_tuote(self.tuote_1)
        self.assertEqual(self.kori.tavaroita_korissa(), 2)

    def test_kahden_saman_tuotteen_lisaamisen_jalkeen_korin_hinta_oikea(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.lisaa_tuote(self.tuote_1)
        self.assertEqual(self.kori.hinta(), 2*self.tuote_1.hinta())

    def test_yhden_tuotteen_lisaamisen_jalkeen_korissa_yksi_ostosolio(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.assertEqual(len(self.kori.ostokset()), 1)

    def test_yhden_tuotteen_lisaamisen_jalkeen_korissa_yksi_ostosolio_jolla_oikea_tuotteen_nimi_ja_maara(self):
        self.kori.lisaa_tuote(self.tuote_1)

        ostos = self.kori.ostokset()[0]
        self.assertEqual(ostos.tuote.nimi(), self.tuote_1.nimi())

    def test_kahden_eri_tuotteen_lisaamisen_jalkeen_korissa_kaksi_ostosolioa(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.lisaa_tuote(self.tuote_2)

        self.assertEqual(len(self.kori.ostokset()), 2)

    def test_kahden_saman_tuotteen_lisaamisen_jalkeen_korissa_yksi_ostosolio(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.lisaa_tuote(self.tuote_1)

        self.assertEqual(len(self.kori.ostokset()), 1)
        ostos = self.kori.ostokset()[0]
        self.assertEqual(ostos.lukumaara(), 2)

    def test_kahden_saman_tuotteen_lisaamisen_ja_yhden_poiston_jalkeen_korissa_yksi_ostosolio_jossa_yksi_tuote(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.poista_tuote(self.tuote_1)

        self.assertEqual(len(self.kori.ostokset()), 1)
        ostos = self.kori.ostokset()[0]
        self.assertEqual(ostos.lukumaara(), 1)

    def test_lisaamisen_ja_poiston_jalkeen_kori_tyhja(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.poista_tuote(self.tuote_1)

        self.assertEqual(len(self.kori.ostokset()), 0)

    def test_lisaamisen_ja_tyhjennyksen_jalkeen_kori_tyhja(self):
        self.kori.lisaa_tuote(self.tuote_1)
        self.kori.tyhjenna()

        self.assertEqual(len(self.kori.ostokset()), 0)
