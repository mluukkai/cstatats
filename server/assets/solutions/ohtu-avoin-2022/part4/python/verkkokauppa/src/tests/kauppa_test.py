import unittest
from unittest.mock import Mock, ANY
from kauppa import Kauppa
from viitegeneraattori import Viitegeneraattori
from varasto import Varasto
from tuote import Tuote

class TestKauppa(unittest.TestCase):
    def setUp(self):
        self.pankki_mock = Mock()

        self.viitegeneraattori_mock = Mock()
        self.viitegeneraattori_mock.uusi.side_effect = [42, 43, 44]
        self.varasto_mock = Mock()

        tuotteet = {
          1: (Tuote(1, "maito", 5), 10),
          2: (Tuote(2, "olut", 7), 20),
          3: (Tuote(3, "juusto", 18), 0)
        }

        # tehdään toteutus saldo-metodille
        def varasto_saldo(tuote_id):
            return tuotteet[tuote_id][1]

        # tehdään toteutus hae_tuote-metodille
        def varasto_hae_tuote(tuote_id):
            return tuotteet[tuote_id][0]

        # otetaan toteutukset käyttöön
        self.varasto_mock.saldo.side_effect = varasto_saldo
        self.varasto_mock.hae_tuote.side_effect = varasto_hae_tuote

        # alustetaan kauppa
        self.kauppa = Kauppa(self.varasto_mock, self.pankki_mock, self.viitegeneraattori_mock)


    def test_ostoksen_paaytyttya_pankin_metodia_tilisiirto_kutsutaan(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called()

    def test_ostoksen_paaytyttya_pankin_metodia_tilisiirto_kutsutaan_oikeilla_parametreilla(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with("pekka", 42, "12345", "33333-44455" , 5)

    def test_ostos_missa_kaksi_eri_tuotetta(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.lisaa_koriin(2)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with("pekka", 42, "12345", "33333-44455" , 12)

    def test_ostos_missa_kaksi_samaa_tuotetta(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with("pekka", 42, "12345", "33333-44455" , 10)

    def test_ostos_missa_saldoton_tuote(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.lisaa_koriin(3)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with("pekka", 42, "12345", "33333-44455" , 5)

    def test_edellinen_ostos_ei_vaikuta_uuteen_ostokseen(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with("pekka", 42, "12345", "33333-44455" , 5)

        self.kauppa.aloita_asiointi()
        for i in range(10):
          self.kauppa.lisaa_koriin(2)
        self.kauppa.tilimaksu("kalle", "44444-4444")
        self.pankki_mock.tilisiirto.assert_called_with("kalle", ANY, "44444-4444", "33333-44455" , 70)

    def test_viitenumero_on_aina_uusi(self):
        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("pekka", "12345")

        self.pankki_mock.tilisiirto.assert_called_with("pekka", 42, "12345", "33333-44455" , 5)

        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("kalle", "44444-4444")
        self.pankki_mock.tilisiirto.assert_called_with("kalle", 43, "44444-4444", "33333-44455" , 5)

        self.kauppa.aloita_asiointi()
        self.kauppa.lisaa_koriin(1)
        self.kauppa.tilimaksu("kalle", "44444-4444")
        self.pankki_mock.tilisiirto.assert_called_with("kalle", 44, "44444-4444", "33333-44455" , 5)