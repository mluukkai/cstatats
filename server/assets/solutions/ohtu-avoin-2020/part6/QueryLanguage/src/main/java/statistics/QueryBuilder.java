
package statistics;

import statistics.matcher.All;
import statistics.matcher.And;
import statistics.matcher.HasAtLeast;
import statistics.matcher.HasFewerThan;
import statistics.matcher.Matcher;
import statistics.matcher.Or;
import statistics.matcher.PlaysIn;

public class QueryBuilder {
    private Matcher matcher;

    public QueryBuilder() {
        matcher = new All();
    }    
    
    public Matcher build() {
       Matcher  built = matcher; 
       matcher = new All();
       return built;
    } 

    public QueryBuilder playsIn(String team) {
        matcher = new PlaysIn(team);
        return this;
    }

    public QueryBuilder hasAtLeast(int number, String what) {
        matcher = new And(matcher, new HasAtLeast(number, what));
        return this;
    }
    
    public QueryBuilder hasFewerThan(int number, String what) {
        matcher = new And(matcher, new HasFewerThan(number, what));
        return this;
    }    

    public QueryBuilder oneOf(Matcher m1, Matcher m2) {
        matcher = new Or(m1, m2);
        return this;
    }
}
