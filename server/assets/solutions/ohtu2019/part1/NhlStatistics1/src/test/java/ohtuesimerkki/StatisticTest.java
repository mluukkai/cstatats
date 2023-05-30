
package ohtuesimerkki;

import java.util.ArrayList;
import java.util.List;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

public class StatisticTest {
 
    Reader readerStub = new Reader() {
 
        public List<Player> getPlayers() {
            ArrayList<Player> players = new ArrayList<>();
 
            players.add(new Player("Semenko", "EDM", 4, 12));
            players.add(new Player("Lemieux", "PIT", 45, 54));
            players.add(new Player("Kurri",   "EDM", 37, 53));
            players.add(new Player("Yzerman", "DET", 42, 56));
            players.add(new Player("Gretzky", "EDM", 35, 89));
 
            return players;
        }
    };
 
    Statistics stats;

    @Before
    public void setUp(){
        stats = new Statistics(readerStub);
    } 
    
    @Test
    public void findsTeam() {
        List<Player> players = stats.team("EDM");
        assertEquals(3, players.size());
        players.forEach(p -> {
           assertEquals("EDM", p.getTeam()); 
        });
    }
    
    @Test
    public void findsExistingPlayer() {
        Player player = stats.search("Kurri");
        assertEquals("Kurri", player.getName());
    }   
    
    @Test
    public void nonexistingPlayerReturnsNull() {
        Player player = stats.search("Hellas");
        assertEquals(null, player);
    }  
    
    @Test
    public void topScorers() {
        List<Player> players = stats.topScorers(3);
        assertEquals(3, players.size()); 
        Player top = players.get(0);
        assertEquals("Gretzky", top.getName());
    }
}