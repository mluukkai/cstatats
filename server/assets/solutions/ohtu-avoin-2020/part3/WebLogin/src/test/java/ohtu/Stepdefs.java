package ohtu;

import io.cucumber.java.After;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import static org.junit.Assert.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

public class Stepdefs {
    //WebDriver driver = new ChromeDriver();
    WebDriver driver = new HtmlUnitDriver();
    String baseUrl = "http://localhost:4567";
    
    @Given("login is selected")
    public void loginIsSelected() {
        linkIsClicked("login");   
    }    
        
    @When("correct username {string} and password {string} are given")
    public void correctUsernameAndPasswordAreGiven(String username, String password) {
        logInWith(username, password);
    }    
    
    @Then("user is logged in")
    public void userIsLoggedIn() {
        pageHasContent("Ohtu Application main page");
    }    
 
    @When("correct username {string} and incorrect password {string} are given")
    public void correctUsernameAndIncorrectPasswordAreGiven(String username, String password) {
        logInWith(username, password);
    }    
    
    @Then("user is not logged in and error message is given")
    public void userIsNotLoggedInAndErrorMessageIsGiven() {
        pageHasContent("invalid username or password");
        pageHasContent("Give your credentials to login");
    }    
    
    @When("nonexistent username {string} and incorrect any password are given")
    public void nonexistentUsernameAndIncorrectAnyPasswordAreGiven(String username) {
        logInWith(username, "secret123");
    }
    
    @Given("command new user is selected")
    public void commandNewUserIsSelected() {
        linkIsClicked("register new user");
    }    
    
    @When("a valid username {string} and password {string} and matching password confirmation are entered")
    public void aValidUsernameAndPasswordAndMatchingPasswordConfirmationAreEntered(String username, String password) {
        newUserWith(username, password, password);
    }
    
    @When("too short username {string} and password {string} and matching password confirmation are entered")
    public void tooShortUsernameAndPasswordAndMatchingPasswordConfirmationAreEntered(String username, String password) {
        newUserWith(username, password, password);
    }

    @When("a proper username {string} and too short password {string} and matching password confirmation are entered")
    public void aProperUsernameAndTooShortPasswordAndMatchingPasswordConfirmationAreEntered(String username, String password) {
        newUserWith(username, password, password);
    }    
    
    @When("a proper username {string} and password {string} and non matching password confirmation are entered")
    public void aProperUsernameAndPasswordAndNonMatchingPasswordConfirmationAreEntered(String username, String password) {
        newUserWith(username, password, password+ "x");
    }    
    
    @Then("user is not created and error {string} is reported")
    public void userIsNotCreatedAndErrorIsReported(String error) {
        pageHasContent(error);
    }
    
    @Then("a new user is created")
    public void aNewUserIsCreated() {
        pageHasContent("Welcome to Ohtu Application!");
    }
   
    @Given("user with username {string} with password {string} is successfully created")
    public void userWithUsernameWithPasswordIsSuccessfullyCreated(String username, String password) {
        linkIsClicked("register new user");
        newUserWith(username, password, password);
    }    
    
    @Given("user with username {string} and password {string} is tried to be created")
    public void userWithUsernameAndPasswordIsTriedToBeCreated(String username, String password) {
        linkIsClicked("register new user");
        newUserWith(username, password, password);
    }
       
    @When("username {string} and password {string} are given")
    public void usernameAndPasswordAreGiven(String username, String password) {
        logInWith(username, password);
    } 
    
    @After
    public void tearDown(){
        driver.quit();
    }
        
    /* helper methods */
    
    private void newUserWith(String username, String password, String passwordConf) {
        WebElement element = driver.findElement(By.name("username"));
        element.sendKeys(username);
        element = driver.findElement(By.name("password"));
        element.sendKeys(password);
        element = driver.findElement(By.name("passwordConfirmation"));
        element.sendKeys(passwordConf);
        element = driver.findElement(By.name("signup"));
        element.submit(); 
    }    
    
    private void linkIsClicked(String text) {
        driver.get(baseUrl);
        WebElement element = driver.findElement(By.linkText(text));
        element.click();
    } 
     
    private void pageHasContent(String content) {
        assertTrue(driver.getPageSource().contains(content));
    }
        
    private void logInWith(String username, String password) {
        assertTrue(driver.getPageSource().contains("Give your credentials to login"));
        WebElement element = driver.findElement(By.name("username"));
        element.sendKeys(username);
        element = driver.findElement(By.name("password"));
        element.sendKeys(password);
        element = driver.findElement(By.name("login"));
        element.submit();  
    } 
}
