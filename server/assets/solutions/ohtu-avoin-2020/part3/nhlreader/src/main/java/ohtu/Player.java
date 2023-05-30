
package ohtu;

public class Player implements Comparable<Player> {
    private static String p(int v, int padding) {
        String padder = "";
        for (int i = 0; i < padding-(""+v).length(); i++) {
            padder += " ";
        }
        return padder+v;
    }
    
    private static String p(String s, int padding) {
        String padder = "";
        for (int i = 0; i < padding-s.length(); i++) {
            padder += " ";
        }
        return s + padder;
    }
    
    private String name;
    private String nationality;
    private String team;
    private int goals;
    private int assists;
    
    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getNationality() {
        return nationality;
    }

    public void setAssists(int assists) {
        this.assists = assists;
    }

    public void setGoals(int goals) {
        this.goals = goals;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public int getAssists() {
        return assists;
    }

    public int getGoals() {
        return goals;
    }

    public String getTeam() {
        return team;
    }

    private int points() {
        return goals + assists;
    }
    
    @Override
    public String toString() {
        return p(name, 20) +  p(team, 4) + p(goals,3) + " + "+ p(assists,2) + " = "+ p(points(), 2);
    }

    @Override
    public int compareTo(Player other) {
        if ( points() > other.points()) {
            return -1;
        } else if ( points() < other.points()) {
            return 1;
        }
        
        return other.goals - goals;
    }
      
}
