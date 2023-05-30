
package ohtu.kivipaperisakset;

import ohtu.kivipaperisakset.tekoaly.NormaaliTekoaly;
import ohtu.kivipaperisakset.tekoaly.TekoalyParannettu;
import java.util.Scanner;

// abstrakti luokka joka sisältää pelin rungon
public abstract class KiviPaperiSakset {
    protected static final Scanner scanner = new Scanner(System.in);
    
    // peliolion luomisen hoitava tehdasmetodi
    public static KiviPaperiSakset peli(String valinta) {
        if ("a".equals(valinta)) {
            return new KPSPelaajaVsPelaaja();
        } else if  ("b".equals(valinta)) {
            return new KPSTekoaly(new NormaaliTekoaly());
        } else{
            return new KPSTekoaly(new TekoalyParannettu(20));
        }  
    }
    
    // itse pelaamisen hoitava template metodi
    public void pelaa() {
        Tuomari tuomari = new Tuomari();

        String ekanSiirto = ensimmaisenSiirto();
        String tokanSiirto = toisenSiirto();
        
        while (onkoOkSiirto(ekanSiirto) && onkoOkSiirto(tokanSiirto)) {
            tuomari.kirjaaSiirto(ekanSiirto, tokanSiirto);
            System.out.println(tuomari);
            System.out.println();
            
            ekanSiirto = ensimmaisenSiirto();
            tokanSiirto = toisenSiirto();
            muistaSiirto(ekanSiirto);
        }

        System.out.println();
        System.out.println("Kiitos!");
        System.out.println(tuomari);
    }
    
    protected String ensimmaisenSiirto() {
        System.out.println("Ensimmäisen pelaajan siirto: ");
        return scanner.nextLine();
    }

    // tämä on abstrakti metodi sillä sen toteutus vaihtelee eri pelityypeissä
    abstract protected String toisenSiirto();
    
    protected static boolean onkoOkSiirto(String siirto) {
        return "k".equals(siirto) || "p".equals(siirto) || "s".equals(siirto);
    }

    // oletusaarvoisesti riittää että ei tehdä mitään
    protected void muistaSiirto(String ekanSiirto) {
    }
}
