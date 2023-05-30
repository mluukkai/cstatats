import unittest
from unittest.mock import Mock, ANY
from kauppa import Kauppa
from viitegeneraattori import Viitegeneraattori
from varasto import Varasto
from tuote import Tuote

TILI = "33333-44455"


class TestKauppa(unittest.TestCase):
    def setUp(self):
        self.pankki_mock = Mock()
        viitegeneraattori_mock = Mock()

        viitegeneraattori_mock.uusi.side_effect = [42, 43, 44]

        varasto_mock = Mock()

        def varasto_saldo(tuote_id):
            if tuote_id == 1:
                return 10
            if tuote_id == 2:
                return 20
            if tuote_id == 3:
                return 0

        def varasto_hae_tuote(tuote_id):
            if tuote_id == 1:
                return Tuote(1, "maito", 5)
            if tuote_id == 2:
                return Tuote(1, "juusto", 3)
            if tuote_id == 4:
                return Tuote(1, "olut", 3)

        varasto_mock.saldo.side_effect = varasto_saldo
        varasto_mock.hae_tuote.side_effect = varasto_hae_tuote

        self.kauppa = Kauppa(varasto_mock, self.pankki_mock,
                             viitegeneraattori_mock)

    def test_yhden_ostoksen_paaytyttya_pankin_metodia_tilisiirto_kutsutaan_oikein(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with(
            "pekka", 42, "12345", TILI, 5)

    def test_kahden_eri_ostoksen_paaytyttya_pankin_metodia_tilisiirto_kutsutaan_oikein(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.lisaa_koriin(2)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with(
            "pekka", 42, "12345", TILI, 8)

    def test_kahden_saman_ostoksen_paaytyttya_pankin_metodia_tilisiirto_kutsutaan_oikein(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with(
            "pekka", 42, "12345", TILI, 10)

    def test_lopussa_olevan_tuotteen_ostoksen_paaytyttya_pankin_metodia_tilisiirto_kutsutaan_oikein(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.lisaa_koriin(3)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with(
            "pekka", 42, "12345", TILI, 5)

    def test_asionnin_aloitus_nollaa_edellisen_ostoksen_tiedot(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with(
            "pekka", 42, "12345", TILI, 5)

        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(2)
        self.kauppa.lisaa_koriin(2)
        self.kauppa.tilimaksu("kalle", "22222")

        self.pankki_mock.tilisiirto.assert_called_with(
            "kalle", ANY, "22222", TILI, 6)

    def test_jokaisella_ostoksella_oma_viitenumero(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("kalle", "22222")

        self.pankki_mock.tilisiirto.assert_called_with(
            "kalle", 42, "22222", TILI, 5)

        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("kalle", "22222")

        self.pankki_mock.tilisiirto.assert_called_with(
            "kalle", 43, "22222", TILI, 5)

        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("kalle", "22222")

        self.pankki_mock.tilisiirto.assert_called_with(
            "kalle", 44, "22222", TILI, 5)

    def test_korista_poistettu_ostos_ei_vaikuta_hintaan(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.lisaa_koriin(1)
        self.kauppa.poista_korista(1)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with(
            "pekka", 42, "12345", TILI, 5)
