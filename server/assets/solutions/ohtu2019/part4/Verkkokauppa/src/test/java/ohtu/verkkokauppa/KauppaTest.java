package ohtu.verkkokauppa;

import org.junit.Before;
import org.junit.Test;
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
        when(viite.uusi())
            .thenReturn(42)
            .thenReturn(43)
            .thenReturn(44);
        
        varasto = mock(Varasto.class);
        when(varasto.saldo(1)).thenReturn(10); 
        when(varasto.haeTuote(1)).thenReturn(new Tuote(1, "maito", 5));
        when(varasto.saldo(2)).thenReturn(10); 
        when(varasto.haeTuote(2)).thenReturn(new Tuote(2, "olut", 3));
        when(varasto.saldo(3)).thenReturn(0); 
        when(varasto.haeTuote(3)).thenReturn(new Tuote(3, "leipä", 4));        
        
        k = new Kauppa(varasto, pankki, viite); 
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

        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), eq("33333-44455"), eq(5));   
    }  
    
    @Test
    public void kahdenEriTuotteenOstoksenPaaytyttyaPankinMetodiaTilisiirtoKutsutaanOikeillaParametreilla() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);    
        k.lisaaKoriin(2);    
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), eq("33333-44455"), eq(8));   
    }      
    
    @Test
    public void kahdenSamanTuotteenOstoksenPaaytyttyaPankinMetodiaTilisiirtoKutsutaanOikeillaParametreilla() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);    
        k.lisaaKoriin(1);    
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), eq("33333-44455"), eq(10));   
    }   
    
    @Test
    public void tuoteJokaOnLoppuEiPaadiOstokeen() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);    
        k.lisaaKoriin(3);    
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), eq("33333-44455"), eq(5));   
    }   
    
    @Test
    public void edellinenOstosEiVaikutaNykyisenOstoksenHintaan() {
        k.aloitaAsiointi();
        k.lisaaKoriin(2);   
        k.lisaaKoriin(2);   
        k.lisaaKoriin(2);   
        k.lisaaKoriin(2);   
        k.tilimaksu("Jon Doe", "00000");    
        
        verify(pankki).tilisiirto(anyString(), anyInt(), anyString(), anyString(),anyInt());
        
        k.aloitaAsiointi();
        k.lisaaKoriin(1);    
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(eq("pekka"), eq(43), eq("12345"), eq("33333-44455"), eq(5));   
    }      
    
    @Test
    public void jokaisessaOstoksessaOmaViitenumero() {
        k.aloitaAsiointi();
        k.lisaaKoriin(2);   
        k.tilimaksu("Jon Doe", "00000");    
        
        verify(pankki).tilisiirto(anyString(), eq(42), anyString(), anyString(),anyInt());
        
        k.aloitaAsiointi();
        k.lisaaKoriin(1);    
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(anyString(), eq(43), anyString(), anyString(),anyInt());
        
        k.aloitaAsiointi();
        k.lisaaKoriin(3);    
        k.tilimaksu("Donald Trump", "76543");

        verify(pankki).tilisiirto(anyString(), eq(44), anyString(), anyString(),anyInt());  
    }
    
    @Test
    public void koristaPoistettuaOstostaEiVeloiteta() {
        k.aloitaAsiointi();
        k.lisaaKoriin(1);    
        k.lisaaKoriin(2);   
        k.poistaKorista(2);
        k.tilimaksu("pekka", "12345");

        verify(pankki).tilisiirto(eq("pekka"), eq(42), eq("12345"), eq("33333-44455"), eq(5));   
    }      
}
