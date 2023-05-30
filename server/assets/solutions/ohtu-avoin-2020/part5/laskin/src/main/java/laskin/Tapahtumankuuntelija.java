package laskin;

import javafx.event.Event;
import javafx.event.EventHandler;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import java.util.Map;
import java.util.HashMap; 

public class Tapahtumankuuntelija implements EventHandler {
  private TextField tuloskentta; 
  private TextField syotekentta; 
  private Button plus;
  private Button miinus;
  private Button nollaa;
  private Button undo;
  private Sovelluslogiikka sovellus;
  private Map<Button, Komento> komennot;
  private Komento edellinenKomento;

  public Tapahtumankuuntelija(TextField tuloskentta, TextField syotekentta, Button plus, Button miinus, Button nollaa, Button undo) {
    this.tuloskentta = tuloskentta;
    this.syotekentta = syotekentta;
    this.undo = undo;
    this.nollaa = nollaa;
    this.sovellus = new Sovelluslogiikka();

    komennot = new HashMap<>();

    komennot.put(plus, new Summa(sovellus));
    komennot.put(miinus, new Erotus(sovellus));
    komennot.put(nollaa, new Nollaa(sovellus));
  }
  
  @Override
  public void handle(Event event) {
    if (event.getTarget() != undo) {
      Komento komento = komennot.get((Button)event.getTarget());

      komento.suorita(syotekentta.getText());

      edellinenKomento = komento;

      undo.disableProperty().set(false);
    } else {
      edellinenKomento.peru();
      edellinenKomento = null;

      undo.disableProperty().set(true);
    }
    
    int laskunTulos = sovellus.tulos();

    syotekentta.setText("");
    tuloskentta.setText("" + laskunTulos);

    if (laskunTulos == 0) {
      nollaa.disableProperty().set(true);
    } else {
      nollaa.disableProperty().set(false);
    }
  }
}
