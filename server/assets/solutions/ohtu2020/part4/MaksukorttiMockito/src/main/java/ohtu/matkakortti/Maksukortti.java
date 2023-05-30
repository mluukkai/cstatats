package ohtu.matkakortti;

// ÄLÄ MUUTA TÄMÄN LUOKAN KOODIA
public class Maksukortti {

    private int saldo;

    public Maksukortti(int saldo) {
        this.saldo = saldo;
    }

    public int getSaldo() {
        return saldo;
    }

    public void lataa(int maara) {
        saldo += maara;
    }

    public void osta(int hinta) {
        saldo -= hinta;
    }
}
