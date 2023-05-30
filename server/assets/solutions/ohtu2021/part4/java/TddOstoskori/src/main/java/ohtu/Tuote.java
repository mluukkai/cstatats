package ohtu;

public class Tuote  {
 
    private String nimi;
    private int hinta;
    private int saldo;
 
    public Tuote(String nimi, int hinta) {
        this.nimi = nimi;
        this.hinta = hinta;
    }
 
    public void setHinta(int hinta) {
        this.hinta = hinta;
    }
 
    public int getHinta() {
        return hinta;
    }
 
    public String getNimi() {
        return nimi;
    }
 
    public int getSaldo() {
        return saldo;
    }
 
    public void setSaldo(int saldo) {
        this.saldo = saldo;
    }
 
    @Override
    public String toString() {
        return nimi + " " + hinta + " euroa";
    }
}