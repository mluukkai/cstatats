
package ohtu;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.apache.http.client.fluent.Request;

public class Main {

    public static void main(String[] args) throws IOException {
        String url = "https://nhlstatisticsforohtu.herokuapp.com/players";
        
        String bodyText = Request.Get(url).execute().returnContent().asString();
                
        Gson mapper = new Gson();
        List<Player> players = Arrays.asList(mapper.fromJson(bodyText, Player[].class));
        
        System.out.println("Oliot:");
        for (Player player : players) {
            if ( player.getNationality().equals("FIN")) {
                System.out.println(player);
            }
            
        }   
    }
}
