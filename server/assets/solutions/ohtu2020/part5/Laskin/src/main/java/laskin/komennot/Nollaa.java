
package laskin.komennot;

import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import laskin.Sovelluslogiikka;

public class Nollaa extends Komento {
    private int arvoEnnenNollausta;
    public Nollaa(TextField tuloskentta, TextField syotekentta, Button nollaa, Button undo, Sovelluslogiikka sovellus) {
        super(tuloskentta, syotekentta, nollaa, undo, sovellus);
    }
    
    @Override
    public void teeOperaatio() { 
        arvoEnnenNollausta = sovellus.tulos();
        sovellus.nollaa();
    }

    @Override 
    public void peruOperaatio() {
        sovellus.plus(arvoEnnenNollausta);
    }    
}
