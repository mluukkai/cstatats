package laskin;

public abstract class Komento {
  protected Sovelluslogiikka sovellus;
  protected int edellinenTulos;

  public Komento(Sovelluslogiikka sovellus) {
    this.sovellus = sovellus;
    this.edellinenTulos = sovellus.tulos();
  }

  public void suorita(String syote) {
    edellinenTulos = sovellus.tulos();
  };

  public void peru() {
    sovellus.setTulos(edellinenTulos);
  };
}