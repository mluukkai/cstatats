package ohtu;

public class Ostos {
 
    private int lkm;
    private Tuote tuote;
 
    public Ostos(Tuote tuote) {
        this.lkm = 1;
        this.tuote = tuote;
    }
 
    public int hinta() {
        return lkm * tuote.getHinta();
    }
 
    public int lukumaara() {
        return lkm;
    }
 
    public String tuotteenNimi() {
        return tuote.getNimi();
    }
 
    public void muutaLukumaaraa(int muutos) {
        lkm += muutos;
        if ( lkm<0 ) {
            lkm = 0;
        }
    }

    @Override
    public int hashCode() {
        return this.tuote.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
    
        Ostos other = (Ostos) obj;

        return this.tuote.equals(other.tuote);
    }
}