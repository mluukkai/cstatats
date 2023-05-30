
package ohtu;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import static org.junit.Assert.*;

public class Stepdefs {
    Counter counter;
    
    @Given("Counter is initialized")
    public void counterIsInitialized() {
        counter = new Counter();
    }

    @When("it is incremented")
    public void itIsIncremented() {
        counter.increase();
    }

    @Then("the value should be {int}")
    public void theValueShouldBe(Integer val) {
        assertEquals(val.intValue(), counter.value());
    }

    @When("it is incremented by {int}")
    public void itIsIncrementedBy(Integer val) {
         counter.increment(val);       
    }    

}