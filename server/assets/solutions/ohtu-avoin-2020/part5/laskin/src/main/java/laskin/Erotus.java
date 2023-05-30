package laskin;

public class Erotus extends Komento {
  public Erotus(Sovelluslogiikka sovellus) {
    super(sovellus);
  }

  @Override
  public void suorita(String syote) {
    super.suorita(syote);

    try {
      int arvo = Integer.parseInt(syote);
      sovellus.miinus(arvo);
    } catch (Exception e) {}
  }

  @Override
  public void peru() {
    super.peru();
  }
}