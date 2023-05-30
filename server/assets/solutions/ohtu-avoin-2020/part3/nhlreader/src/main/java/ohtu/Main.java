package ohtu;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.http.client.fluent.Request;

public class Main {
    
    public static void main(String[] args) throws IOException {
        String url = "https://nhlstatisticsforohtu.herokuapp.com/players";
        
        String bodyText = Request.Get(url).execute().returnContent().asString();
                
        Gson mapper = new Gson();
        Player[] players = mapper.fromJson(bodyText, Player[].class);

        System.out.println("Players from FIN " + new Date().toString());
        System.out.println("");
        
        
        
        List<Player> finnish = Arrays.stream(players)
                .filter(p->p.getNationality()
                .equals("FIN"))
                .sorted()
                .collect(Collectors.toList());
        
        for (Player player : finnish) {
            System.out.println(player);
        }
        
    }
  
}
