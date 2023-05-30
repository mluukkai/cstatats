package ohtu.verkkokauppa;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class KauppaTest {

    Pankki pankki;
    Viitegeneraattori viite;
    Varasto varasto;
    Kauppa k;
    
    @Before
    public void setUp() {
        pankki = mock(Pankki.class);
        viite = mock(Viitegeneraattori.class);
        varasto = mock(Varasto.class);
        k = new Kauppa(varasto, pankki, viite);  
        
        when(viite.uusi())
            .thenReturn(42)
            .thenReturn(43)
            .thenReturn(44);
        
        when(varasto.saldo(1)).thenReturn(10); 
        when(varasto.haeTuote(1)).thenReturn(new Tuote(1, "maito", 5));
        when(varasto.saldo(2)).thenReturn(24); 
        when(varasto.haeTuote(2)).thenReturn(new Tuote(2, "olut", 6));
        when(varasto.saldo(3)).thenReturn(0); 
        when(varasto.haeTuote(3)).thenReturn(new Tuote(3, "Playstation 5", 499));
    }
  
    
    @Test
    public void ostoksenPaaytyttyaPankinMetodiaTilisiirtoKutsutaan() {  
        k.aloitaAsiointi();
        k.lisaaKoriin(1);
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(anyString(), anyInt(), anyString(), anyString(),anyInt());   
    }
    
    @Test
    public void ostoksenPaaytyttyaPankinMetodiaTilisiirtoKutsutaanOikeillaParametreilla() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), anyString(), eq(5));   
    }

    @Test
    public void kahdenEriTuotteenOstoksenPaaytyttyaPankinMetodiaTilisiirtoKutsutaanOikeillaParametreilla() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);
        k.lisaaKoriin(2);
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), anyString(), eq(11));   
    }
    
    @Test
    public void kahdenSamanTuotteenOstoksenPaaytyttyaPankinMetodiaTilisiirtoKutsutaanOikeillaParametreilla() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);
        k.lisaaKoriin(1);
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), anyString(), eq(10));   
    }
    
    @Test
    public void vainVarastossaOlevistaTuotteistaLaskutetaan() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);
        k.lisaaKoriin(3);
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), anyString(), eq(5));   
    }
    
    @Test
    public void edellinenAsiointiEiVaikutaOstoksiin() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);
        k.tilimaksu("pekka", "12345");
 
        k.aloitaAsiointi();
        k.lisaaKoriin(2);
        k.tilimaksu("jukka", "22222");
        
        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), anyString(), eq(5));
        verify(pankki).tilisiirto(eq("jukka"), anyInt(), eq("22222"), anyString(), eq(6));   
    }
    
    @Test
    public void eriOstokissaEriViite() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);
        k.tilimaksu("pekka", "12345");
 
        k.aloitaAsiointi();
        k.lisaaKoriin(2);
        k.tilimaksu("jukka", "22222");
       
        k.aloitaAsiointi();
        k.lisaaKoriin(2);
        k.tilimaksu("frank", "33333");        
        
        verify(pankki).tilisiirto(eq("pekka"), eq(42), anyString(), anyString(), anyInt());   
        verify(pankki).tilisiirto(eq("jukka"), eq(43), anyString(), anyString(), anyInt());   
        verify(pankki).tilisiirto(eq("frank"), eq(44), anyString(), anyString(), anyInt());   
    }
}