package ohtu;

import java.util.HashMap;
import java.util.Map;

public class TennisGame {

    private int score1 = 0;
    private int score2 = 0;
    private final String player1;
    private final String player2;
    private Map<Integer, String> numberToScore = new HashMap<>();
    
    public TennisGame(String player1, String player2) {
        this.player1 = player1;
        this.player2 = player2;
        numberToScore.put(0, "Love");
        numberToScore.put(1, "Fifteen");
        numberToScore.put(2, "Thirty");
        numberToScore.put(3, "Forty");
    }

    public void wonPoint(String player) {
        if (player.equals(player1)) {
            score1 += 1;
        } else {
            score2 += 1;
        }
    }

    public String getScore() {
        if (isEven()) {
            return evenScore();
        } else if (isPossibleWin()) {
            return possibleWinScore();
        }

        return leadScore();
    }

    private boolean isEven() {
        return score1 == score2;
    }

    private boolean isPossibleWin() {
        return score1 >= 4 || score2 >= 4;
    }
    
    private String evenScore() {  
        if (score1 > 3) {
            return "Deuce";
        }
        return numberToScore.get(score1)+"-All";
    }
    
    private String possibleWinScore() {
        String better = score1 > score2 ? player1 : player2;
        String result =  Math.abs(score1 - score2) > 1 ?  "Win for" : "Advantage";
        
        return result + " "+ better;
    }
    
    private String leadScore() {
        return numberToScore.get(score1)+"-"+numberToScore.get(score2);
    }    
}
