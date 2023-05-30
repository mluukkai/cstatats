
package laskin.komennot;

import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import laskin.Sovelluslogiikka;

public abstract class Komento {
    protected TextField tuloskentta; 
    protected TextField syotekentta; 
    protected Button nollaa;
    protected Button undo;
    protected Sovelluslogiikka sovellus;

    public Komento(TextField tuloskentta, TextField syotekentta, Button nollaa, Button undo, Sovelluslogiikka sovellus) {
        this.tuloskentta = tuloskentta;
        this.syotekentta = syotekentta;
        this.nollaa = nollaa;
        this.undo = undo;
        this.sovellus = sovellus;   
    }
    
    public void suorita() {
        
        teeOperaatio();
        
        int laskunTulos = sovellus.tulos();
        
        syotekentta.setText("");
        tuloskentta.setText("" + laskunTulos);
        
        if ( laskunTulos==0) {
            nollaa.disableProperty().set(true);
        } else {
            nollaa.disableProperty().set(false);
        }
    }
    
    public void peru() {
        peruOperaatio();
        
        int laskunTulos = sovellus.tulos();
        
        syotekentta.setText("");
        tuloskentta.setText("" + laskunTulos);
        
        if ( laskunTulos==0) {
            nollaa.disableProperty().set(true);
        } else {
            nollaa.disableProperty().set(false);
        }
    }
    
    protected int haeSyotteenArvo() {
        int arvo = 0;
        try {
            arvo = Integer.parseInt(syotekentta.getText());
        } catch (Exception e) {
        }
        return arvo;
    }
        
    public abstract void teeOperaatio();
    
    public abstract void peruOperaatio();
}
