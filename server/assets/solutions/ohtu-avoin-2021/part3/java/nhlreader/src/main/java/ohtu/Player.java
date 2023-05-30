
package ohtu;

public class Player implements Comparable<Player>{
    private String name;
    private String nationality;
    private int assists;
    private int goals;
    private int penalties;
    private String team;

    public int getAssists() {
        return assists;
    }

    public void setAssists(int assists) {
        this.assists = assists;
    }

    public int getGoals() {
        return goals;
    }

    public void setGoals(int goals) {
        this.goals = goals;
    }

    public int getPenalties() {
        return penalties;
    }

    public void setPenalties(int penalties) {
        this.penalties = penalties;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }  

    private String pad(String content, int width) {
        String padded = content;
        for (int i=content.length(); i<width; i++) {
            padded += " ";
        }
        
        return padded;
    }
   
    private String leftpad(String content, int width) {
        String padded = "";
        for (int i=content.length(); i<width; i++) {
            padded += " ";
        }
        
        return padded+ content;
    }    
    
    public int total(){
        return goals + assists;
    }
    

    @Override
    public String toString() {
        return pad(name, 25) + " "+team + "  "+ leftpad(""+goals, 2)+" + "+  leftpad(""+assists, 2)+" = "+ leftpad(""+total(), 2);
    }
    
    public int compareTo(Player other) {        
        return other.total()-total();
    }
      
}
