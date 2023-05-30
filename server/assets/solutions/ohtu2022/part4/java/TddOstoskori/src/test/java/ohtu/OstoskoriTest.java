package ohtu;

import java.util.List;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

public class OstoskoriTest {

    Ostoskori kori;
    Tuote maito;
    Tuote juusto;

    @Before
    public void setUp() {
        kori = new Ostoskori();
        maito = new Tuote("maito", 5);
        juusto = new Tuote("juusto", 5);
    }

    // step 1
    @Test
    public void ostoskorinHintaJaTavaroidenMaaraAlussa() { 
        assertEquals(0, kori.hinta());
        assertEquals(0, kori.tavaroitaKorissa());
    }

    // step 2
    @Test
    public void yhdenLisaamisenJalkeenKorissaYksiTavara() {
        kori.lisaaTuote(maito);
        assertEquals(1, kori.tavaroitaKorissa());
    }

    // step 3
    @Test
    public void yhdenLisaamisenJalkeenKorillaSamaHintaKunLisatylla() {
        kori.lisaaTuote(maito);
        assertEquals(maito.getHinta(), kori.hinta());
    }

    // step 4
    @Test
    public void kahdenEriTuotteenLisaamisenJalkeenKorissaKaksiTavaraa() {
        kori.lisaaTuote(maito);
        kori.lisaaTuote(juusto);
        assertEquals(2, kori.tavaroitaKorissa());
    }

    // step 5
    @Test
    public void kahdenEriTuotteenLisaamisenJalkeenKorinHintaTuotteidenHintojenSumma() {
        kori.lisaaTuote(maito);
        kori.lisaaTuote(juusto);
        int hinta = maito.getHinta() + juusto.getHinta();
        assertEquals(hinta, kori.hinta());
    }

    // step 6
    @Test
    public void kahdenSamanTuotteenLisaamisenJalkeenKorissaKaksiTavaraa() {
        kori.lisaaTuote(maito);
        kori.lisaaTuote(maito);
        assertEquals(2, kori.tavaroitaKorissa());
    }

    // step 7
    @Test
    public void kahdenSamanTuotteenLisaamisenJalkeenKorinHintaTuotteidenHintojenSumma() {
        kori.lisaaTuote(maito);
        kori.lisaaTuote(maito);
        int hinta = maito.getHinta() * 2;
        assertEquals(hinta, kori.hinta());
    }

    // step 8
    @Test
    public void yhdenTuotteenLisaamisenJalkeenKorissaYksiOstosOlio() {
        kori.lisaaTuote(maito);

        List<Ostos> ostokset = kori.ostokset();

        assertEquals(1, ostokset.size());
    }

    // step 9
    @Test
    public void yhdenTuotteenLisaamisenJalkeenKorissaOikeaOstosOlio() {
        kori.lisaaTuote(maito);

        Ostos ostos = kori.ostokset().get(0);

        assertEquals(1, ostos.lukumaara());
        assertEquals(maito.getNimi(), ostos.tuotteenNimi());
    }

    // step 10
    @Test
    public void kahdenEriTuotteenLisaamisenJalkeenKorissaKaksiOstosOlioa() {
        kori.lisaaTuote(maito);
        kori.lisaaTuote(juusto);
        List<Ostos> ostokset = kori.ostokset();

        assertEquals(2, ostokset.size());
    }

    // step 11
    @Test
    public void kahdenSamanTuotteenLisaamisenJalkeenKorissaYksiOstosOlio() {
        kori.lisaaTuote(maito);
        kori.lisaaTuote(maito);
        List<Ostos> ostokset = kori.ostokset();

        assertEquals(1, ostokset.size());
    }

    // step 12
    @Test
    public void kahdenSamanTuotteenLisaamisenJalkeenKorissaOstosJonkaLukumaaraKaksi() {
        kori.lisaaTuote(maito);
        kori.lisaaTuote(maito);
        Ostos ostos = kori.ostokset().get(0);

        assertEquals(2, ostos.lukumaara());
    }

    // step 13
    @Test
    public void kahdenSamanTuotteenLisaamisenJaYhdenPoistonJalkeenKorissaOstosJossaYksiTuote() {
        kori.lisaaTuote(maito);
        kori.lisaaTuote(maito);
        kori.poista(maito);
        Ostos ostos = kori.ostokset().get(0);

        assertEquals(1, ostos.lukumaara());
    }

    // step 14
    @Test
    public void lisayksenJaPoistonJalkeenKoriTyhja() {
        kori.lisaaTuote(maito);
        kori.poista(maito);
        List<Ostos> ostokset = kori.ostokset();

        assertEquals(0, ostokset.size());
    }

    // step 15
    @Test
    public void tyhjennyksenJalkeenKoriTyhja() {
        kori.lisaaTuote(maito);
        kori.lisaaTuote(maito);
        kori.lisaaTuote(juusto);
        kori.tyhjenna();
        List<Ostos> ostokset = kori.ostokset();

        assertEquals(0, ostokset.size());
    }
}