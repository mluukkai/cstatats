Feature: As a registered user can log in with valid username/password-combination

    Scenario: user can login with correct password
        Given login is selected
        When correct username "jukka" and password "akkuj" are given
        Then user is logged in

    Scenario: user can not login with incorrect password
        Given login is selected
        When correct username "jukka" and incorrect password "wrong" are given
        Then user is not logged in and error message is given

    Scenario: nonexistent user can not login to 
        Given login is selected
        When nonexistent username "janedoe" and incorrect any password are given
        Then user is not logged in and error message is given


    Scenario: user can login with successfully generated account
        Given user with username "lea" with password "salainen1" is successfully created
        And   login is selected
        When correct username "lea" and password "salainen1" are given
        Then user is logged in 

    Scenario: user can not login with account that is not successfully created
        Given user with username "aa" and password "bad" is tried to be created
        And   login is selected
        When  username "aa" and password "aa" are given
        Then  user is not logged in and error message is given 