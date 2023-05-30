package ohtu;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class Ostoskori {
    List<Ostos> ostokset;

    public Ostoskori() {
        ostokset = new ArrayList<>();
    }
 
    public int tavaroitaKorissa() {
        return ostokset.stream().mapToInt(o -> o.lukumaara()).sum();
    }
 
    public int hinta() {
        return ostokset.stream().mapToInt(o -> o.hinta()).sum();
    }

    private Ostos haeOstos(Tuote tuote) {
        Optional<Ostos> ostos = this.ostokset.stream()
                .filter(o -> o.tuotteenNimi() == tuote.getNimi())
                .findFirst();

        if (ostos.isPresent()) {
            return ostos.get();
        }
        return null;
    }

    public void lisaaTuote(Tuote lisattava) {
        Ostos ostos = haeOstos(lisattava);
        if (ostos != null) {
            ostos.muutaLukumaaraa(1);
        } else {
            ostokset.add(new Ostos((lisattava)));
        }
    }
 
    public void poista(Tuote poistettava) {
        Ostos ostos = haeOstos(poistettava);
        ostos.muutaLukumaaraa(-1);
        if (ostos.lukumaara() == 0) {
            ostokset = ostokset.stream()
                    .filter(o -> o.tuotteenNimi() != poistettava.getNimi())
                    .collect(Collectors.toList());
        }
    }
 
    public List<Ostos> ostokset() {
        return ostokset;
    }
 
    public void tyhjenna() {
        ostokset = new ArrayList<>();
    }
}
