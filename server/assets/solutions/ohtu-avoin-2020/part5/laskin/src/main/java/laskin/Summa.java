package laskin;

public class Summa extends Komento {
  public Summa(Sovelluslogiikka sovellus) {
    super(sovellus);
  }

  @Override
  public void suorita(String syote) {
    super.suorita(syote);

    try {
      int arvo = Integer.parseInt(syote);
      sovellus.plus(arvo);
    } catch (Exception e) {}
  }

  @Override
  public void peru() {
    super.peru();
  }
}