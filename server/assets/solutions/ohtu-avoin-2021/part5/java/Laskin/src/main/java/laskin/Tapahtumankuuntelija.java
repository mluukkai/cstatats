package laskin;

import java.util.HashMap;
import java.util.Map;
import javafx.event.Event;
import javafx.event.EventHandler;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import laskin.komennot.Erotus;
import laskin.komennot.Komento;
import laskin.komennot.Nollaa;
import laskin.komennot.Summa;

public class Tapahtumankuuntelija implements EventHandler {
    private TextField tuloskentta; 
    private TextField syotekentta; 
    private Button plus;
    private Button miinus;
    private Button nollaa;
    private Button undo;
    private Sovelluslogiikka sovellus;
    
    private Map<Button, Komento> komennot;
    private Komento edellinen = null;
    
    public Tapahtumankuuntelija(TextField tuloskentta, TextField syotekentta, Button plus, Button miinus, Button nollaa, Button undo) {
        this.tuloskentta = tuloskentta;
        this.syotekentta = syotekentta;
        this.plus = plus;
        this.miinus = miinus;
        this.nollaa = nollaa;
        this.undo = undo;
        this.sovellus = new Sovelluslogiikka();
        komennot = new HashMap<>();
        this.komennot.put(plus, new Summa(tuloskentta, syotekentta,  nollaa, undo, sovellus) );
        this.komennot.put(miinus, new Erotus(tuloskentta, syotekentta, nollaa, undo, sovellus) );
        this.komennot.put(nollaa, new Nollaa(tuloskentta, syotekentta,  nollaa, undo, sovellus) );
    }
    
    @Override
    public void handle(Event event) {
        if ( event.getTarget() != undo ) {
            Komento komento = this.komennot.get((Button)event.getTarget());
            komento.suorita();
            this.edellinen = komento;
            undo.disableProperty().set(false);
        } else {
            this.edellinen.peru();
            this.edellinen = null;
            undo.disableProperty().set(true);
        }             
    }
}
