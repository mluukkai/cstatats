*** Settings ***
Resource  resource.robot
Test Setup  Input New Command

*** Test Cases ***
Register With Valid Username And Password
    Input Credentials  kalle  kalle123
    Output Should Contain  New user registered

Register With Already Taken Username And Valid Password
    Input Credentials  yomi  cosa123
    Output Should Contain  User with username yomi already exists

Register With Too Short Username And Valid Password
    Input Credentials  x  cosa123
    Output Should Contain  Username too short

Register With Valid Username And Too Short Password
    Input Credentials  jami  x
    Output Should Contain  Password too short

Register With Valid Username And Long Enough Password Containing Only Letters
    Input Credentials  jami  topsecred
    Output Should Contain  Password not valid