
package laskin.komennot;

import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import laskin.Sovelluslogiikka;

public class Erotus extends Komento {
    private int vahaennettavaArvo;
    
    public Erotus(TextField tuloskentta, TextField syotekentta, Button nollaa, Button undo, Sovelluslogiikka sovellus) {
        super(tuloskentta, syotekentta, nollaa, undo, sovellus);
    }

    @Override
    public void teeOperaatio() {
        vahaennettavaArvo = haeSyotteenArvo();
        sovellus.miinus(vahaennettavaArvo);
    }
 
    @Override 
    public void peruOperaatio() {
        sovellus.plus(vahaennettavaArvo);
    }        
}
