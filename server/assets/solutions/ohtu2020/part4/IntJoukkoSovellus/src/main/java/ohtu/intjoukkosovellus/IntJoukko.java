
package ohtu.intjoukkosovellus;

public class IntJoukko {

    public final static int KAPASITEETTI = 5, // aloitustalukon koko
                            OLETUSKASVATUS = 5;  // luotava uusi taulukko on 
    // näin paljon isompi kuin vanha
    private int kasvatuskoko;     // Uusi taulukko on tämän verran vanhaa suurempi.
    private int[] luvut;      // Joukon luvut säilytetään taulukon alkupäässä. 
    private int alkioidenLkm;    // Tyhjässä joukossa alkioiden_määrä on nolla. 

    public IntJoukko() {
        this(KAPASITEETTI, OLETUSKASVATUS);
    }

    public IntJoukko(int kapasiteetti) {
        this(kapasiteetti, OLETUSKASVATUS);
    }
    
    
    public IntJoukko(int kapasiteetti, int kasvatuskoko) {
        if (kapasiteetti < 0 || kasvatuskoko < 0) {
            throw new IndexOutOfBoundsException("Kapasiteetin ja kasvatuskoon pitää olla positiivisia");
        }

        luvut = new int[kapasiteetti];
        alkioidenLkm = 0;
        this.kasvatuskoko = kasvatuskoko;

    }

    public boolean lisaa(int luku) {
        
        if (kuuluu(luku)) {
            return false;
        }
        
        luvut[alkioidenLkm] = luku;
        alkioidenLkm++;
        
        if (alkioidenLkm % luvut.length == 0) {
            int[] uusi = new int[alkioidenLkm + kasvatuskoko];
            kopioiTaulukko(luvut, uusi);
            luvut = uusi;
        }

        return true;
    }

    public boolean kuuluu(int luku) {
        return paikassa(luku)>-1;
    }

    private int paikassa(int luku) {
        for (int i = 0; i < alkioidenLkm; i++) {
            if (luku == luvut[i]) {
                return i;
            }
        }
        
        return -1;
    }
    
    public boolean poista(int luku) {
        int kohta = paikassa(luku);
        if (kohta == -1) {
            return false;
        }

        for (int j = kohta; j < alkioidenLkm - 1; j++) {
            luvut[j] = luvut[j + 1];
        }
        
        alkioidenLkm--;
        return true;    
    }

    private void kopioiTaulukko(int[] vanha, int[] uusi) {
        for (int i = 0; i < vanha.length; i++) {
            uusi[i] = vanha[i];
        }

    }

    public int mahtavuus() {
        return alkioidenLkm;
    }

    @Override
    public String toString() {
        if (alkioidenLkm == 0) {
            return "{}";
        }
        
        String tuotos = "";
        for (int i = 0; i < alkioidenLkm - 1; i++) {
            tuotos += luvut[i];
            tuotos += ", ";
        }
        tuotos += luvut[alkioidenLkm - 1];

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
        for (int alkio : a.toIntArray()) {
            tulos.lisaa(alkio);
        }
        for (int alkio : b.toIntArray()) {
            tulos.lisaa(alkio);
        }  

        return tulos;
    }

    public static IntJoukko leikkaus(IntJoukko a, IntJoukko b) {
        IntJoukko tulos = new IntJoukko();
        for (int alkio : a.toIntArray()) {
            if (b.kuuluu(alkio)) {
                tulos.lisaa(alkio);
            }     
        }

        return tulos;
    }
    
    public static IntJoukko erotus (IntJoukko a, IntJoukko b) {
        IntJoukko tulos = new IntJoukko();
        for (int alkio : a.toIntArray()) {
            if (!b.kuuluu(alkio)) {
                tulos.lisaa(alkio);
            }     
        }
        
        return tulos;
    }
        
}
