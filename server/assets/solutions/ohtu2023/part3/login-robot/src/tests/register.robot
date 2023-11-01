*** Settings ***
Resource  resource.robot
Test Setup  Create User And Input New Command

*** Test Cases ***
Register With Valid Username And Password
    Input Credentials  liisa  liisa123
    Output Should Contain  New user registered

Register With Already Taken Username And Valid Password
    Input Credentials  kalle  ellak123
    Output Should Contain  User with username kalle already exists

Register With Too Short Username And Valid Password
    Input Credentials  ka  ekkal123
    Output Should Contain  Invalid username: should have length 3 or more

Register With Enough Long But Invald Username And Valid Password
    Input Credentials  kalle!  ekkal123
    Output Should Contain  Invalid username: should consists of only letters a to z

Register With Valid Username And Too Short Password
    Input Credentials  liisa  liisa12
    Output Should Contain  Invalid password: should have length 8 or more

Register With Valid Username And Long Enough Password Containing Only Letters
    Input Credentials  liisa  liisaliisa
    Output Should Contain  Invalid password: should not only contain letters


*** Keywords ***
Create User And Input New Command
    Create User  kalle  kalle123
    Input New Command