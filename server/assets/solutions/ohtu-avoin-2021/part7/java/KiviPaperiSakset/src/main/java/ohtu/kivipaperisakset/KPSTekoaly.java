package ohtu.kivipaperisakset;

import ohtu.kivipaperisakset.tekoaly.Tekoaly;

public class KPSTekoaly extends KiviPaperiSakset{
    Tekoaly tekoaly;

    public KPSTekoaly(Tekoaly tekoaly) {
        this.tekoaly = tekoaly;
    }
    
    @Override
    protected String toisenSiirto() {
        return tekoaly.annaSiirto();
    }
    
    protected void muistaSiirto(String ekanSiirto) {
        // pelaajan siirto täytyy kertoa tekoälylle
        this.tekoaly.asetaSiirto(ekanSiirto);
    }
}