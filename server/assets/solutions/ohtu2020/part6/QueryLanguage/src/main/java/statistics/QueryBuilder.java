
package statistics;

import statistics.matcher.*;

class QueryBuilder {
   private Matcher matcher;

    public QueryBuilder() {
        this.matcher = new All();
    }
     
    public Matcher build() {
        Matcher built = matcher;
        this.matcher = new All();
        
        return built;
    }

    public QueryBuilder playsIn(String team) {
        matcher = new And(matcher, new PlaysIn(team));
        return this;
    }

    public QueryBuilder hasAtLeast(int n, String what) {
        matcher = new And(matcher, new HasAtLeast(n, what));
        return this;
    }

    public QueryBuilder hasFewerThan(int n, String what) {
        matcher = new And(matcher, new HasFewerThan(n, what));
        return this;
    }

    public QueryBuilder oneOf(Matcher m1, Matcher m2) {
        matcher = new Or(m1, m2);
        return this;
    }
    
}
