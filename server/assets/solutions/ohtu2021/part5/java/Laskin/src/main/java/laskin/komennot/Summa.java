
package laskin.komennot;

import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import laskin.Sovelluslogiikka;


public class Summa extends Komento {
    private int lisattavaArvo;
    
    public Summa(TextField tuloskentta, TextField syotekentta, Button nollaa, Button undo, Sovelluslogiikka sovellus) {
        super(tuloskentta, syotekentta, nollaa, undo, sovellus);
    }
   
    @Override
    public void teeOperaatio() {
        lisattavaArvo = haeSyotteenArvo();
        sovellus.plus(lisattavaArvo);
    }
    
    @Override 
    public void peruOperaatio() {
        sovellus.miinus(lisattavaArvo);
    }    
}
