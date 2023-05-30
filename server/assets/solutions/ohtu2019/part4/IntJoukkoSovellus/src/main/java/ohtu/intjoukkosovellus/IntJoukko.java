
package ohtu.intjoukkosovellus;

public class IntJoukko {

    public final static int KAPASITEETTI = 5, 
                            OLETUSKASVATUS = 5;  

    private int kasvatuskoko;     
    private int[] luvut;     
    private int alkioidenLkm;   

    public IntJoukko() {
        this(KAPASITEETTI, OLETUSKASVATUS);
    }

    public IntJoukko(int kapasiteetti) {
        this(kapasiteetti, OLETUSKASVATUS);
    }
       
    public IntJoukko(int kapasiteetti, int kasvatuskoko) {
        if (kapasiteetti < 0 || kasvatuskoko < 0 ) {
            throw new IndexOutOfBoundsException("Invalid argument");
        }

        luvut = new int[kapasiteetti];
        alkioidenLkm = 0;
        this.kasvatuskoko = kasvatuskoko;

    }

    public boolean lisaa(int luku) {
        if ( kuuluu(luku)) {
            return false;
        }
        
        luvut[alkioidenLkm] = luku;
        alkioidenLkm++;
        
        if (alkioidenLkm % luvut.length == 0) {
            kasvataTaulukkoa();
        }
        
        return true;
    }

    private void kasvataTaulukkoa() {
        int [] uusiLuvut = new int[alkioidenLkm + kasvatuskoko];
        for (int i = 0; i < luvut.length; i++) {
            uusiLuvut[i] = luvut[i];
        }

        luvut = uusiLuvut;
    }

    public boolean kuuluu(int luku) {
        return luvunIndeksi(luku) != -1;
    }

    private int luvunIndeksi(int luku) {
        for (int i = 0; i < alkioidenLkm; i++) {
            if (luku == luvut[i]) {
                return i;
            }
        }
        return -1;
    }

    public boolean poista(int luku) {
        int kohta = luvunIndeksi(luku);
     
        if (kohta<0) {
            return false;
        }
    
        for (int j = kohta; j < alkioidenLkm - 1; j++) {
            luvut[j] = luvut[j + 1];
        }
        
        alkioidenLkm--;

        return true;
    }

    public int mahtavuus() {
        return alkioidenLkm;
    }


    @Override
    public String toString() {
        String tuotos = "";

        if (alkioidenLkm > 0) {
            for (int i = 0; i < alkioidenLkm - 1; i++) {
                tuotos += luvut[i];
                tuotos += ", ";
            }
            tuotos += luvut[alkioidenLkm - 1];
        }
        
        return "{" + tuotos + "}";
    }

    public int[] toIntArray() {
        int[] taulu = new int[alkioidenLkm];
        for (int i = 0; i < taulu.length; i++) {
            taulu[i] = luvut[i];
        }
        return taulu;
    }
   

    public static IntJoukko yhdiste(IntJoukko a, IntJoukko b) {
        IntJoukko tulos = new IntJoukko();
        
        for (int luku : a.toIntArray()) {
                tulos.lisaa(luku);
        }
        
        for (int luku : b.toIntArray()) {
                tulos.lisaa(luku);
        }
        
        return tulos;
    }

    public static IntJoukko leikkaus(IntJoukko a, IntJoukko b) {
        IntJoukko tulos = new IntJoukko();
        
        for (int luku : a.toIntArray()) {
            if (b.kuuluu(luku)) {
               tulos.lisaa(luku); 
            }
                
        }
        return tulos;    
    }
    
    public static IntJoukko erotus (IntJoukko a, IntJoukko b) {
        IntJoukko tulos = new IntJoukko();
        
        for (int luku : a.toIntArray()) {
            if (!b.kuuluu(luku)) {
               tulos.lisaa(luku); 
            }
                
        }
        return tulos; 
    }
        
}