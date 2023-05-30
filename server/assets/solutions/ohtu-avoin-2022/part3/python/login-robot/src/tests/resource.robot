*** Settings ***
Library  ../AppLibrary.py

*** Keywords ***
Input Login Command
    Input  login

Input New Command
    Input  new

Input Credentials
    [Arguments]  ${username}  ${password}
    Input  ${username}
    Input  ${password}
    Run Application
