package ohtu.ohtuvarasto;

import main.ohtuvarasto.Main;
import varasto.Varasto;
import org.junit.*;
import static org.junit.Assert.*;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

public class VarastoTest {

    Varasto varasto;
    double vertailuTarkkuus = 0.0001;

    @Before
    public void setUp() {
        varasto = new Varasto(10);
    }

    @Test
    public void konstruktoriLuoTyhjanVaraston() {
        assertEquals(0, varasto.getSaldo(), vertailuTarkkuus);
    }

    @Test
    public void uudellaVarastollaOikeaTilavuus() {
        assertEquals(10, varasto.getTilavuus(), vertailuTarkkuus);
    }

    @Test
    public void lisaysLisaaSaldoa() {
        varasto.lisaaVarastoon(8);

        // saldon pitäisi olla sama kun lisätty määrä
        assertEquals(8, varasto.getSaldo(), vertailuTarkkuus);
    }

    @Test
    public void lisaysLisaaPienentaaVapaataTilaa() {
        varasto.lisaaVarastoon(8);

        // vapaata tilaa pitäisi vielä olla tilavuus-lisättävä määrä eli 2
        assertEquals(2, varasto.paljonkoMahtuu(), vertailuTarkkuus);
    }

    @Test
    public void ottaminenPalauttaaOikeanMaaran() {
        varasto.lisaaVarastoon(8);

        double saatuMaara = varasto.otaVarastosta(2);

        assertEquals(2, saatuMaara, vertailuTarkkuus);
    }

    @Test
    public void ottaminenLisääTilaa() {
        varasto.lisaaVarastoon(8);

        varasto.otaVarastosta(2);

        // varastossa pitäisi olla tilaa 10 - 8 + 2 eli 4
        assertEquals(4, varasto.paljonkoMahtuu(), vertailuTarkkuus);
    }

    @Test
    public void negatiivinenTilavuusMuuttuuNollaksi() {
        varasto = new Varasto(-10);

        assertEquals(varasto.getTilavuus(), 0.0, vertailuTarkkuus);
    }

    @Test
    public void negatiivinenLisäysEiMuutaMäärää() {
        varasto.lisaaVarastoon(-5);

        assertEquals(varasto.getSaldo(), 0, vertailuTarkkuus);
    }

    @Test
    public void yliMeneväMeneeYli() {
        varasto.lisaaVarastoon(varasto.getTilavuus() * 2);

        assertEquals(varasto.getSaldo(), varasto.getTilavuus(), vertailuTarkkuus);
    }

    @Test
    public void negatiivinenOttoEiMuutaMäärää() {
        varasto.otaVarastosta(-5);

        assertEquals(varasto.getSaldo(), 0, vertailuTarkkuus);
    }

    @Test
    public void liikaaOttaminenAntaaVainSenMitäVoidaan() {
        varasto.lisaaVarastoon(5);

        assertEquals(varasto.otaVarastosta(10), 5, vertailuTarkkuus);
    }

    @Test
    public void tulostusToimiiOikein() {
        varasto.lisaaVarastoon(5);

        assertTrue(varasto.toString().equals("saldo = 5.0, vielä tilaa 5.0"));
    }

    @Test
    public void konstruktoriAlkusaldollaToimii() {
        varasto = new Varasto(10, 5);

        assertEquals(varasto.getTilavuus(), 10, vertailuTarkkuus);
        assertEquals(varasto.getSaldo(), 5, vertailuTarkkuus);
    }

    @Test
    public void konstruktoriAlkusaldollaNollaaTilavuudenJosTilavuusNegatiivinen() {
        varasto = new Varasto(-10, 0);

        assertEquals(varasto.getTilavuus(), 0, vertailuTarkkuus);
    }

    @Test
    public void konstruktoriAlkusaldollaNollaaSaldonJosTilavuusSaldo() {
        varasto = new Varasto(10, -5);

        assertEquals(varasto.getSaldo(), 0, vertailuTarkkuus);
    }

    @Test
    public void konsAtruktoriAlkusaldollaNollaaSaldonJosTilavuusSaldo() {
        Main main = new Main();
        main.main(new String[0]);
    }
}
