*** Settings ***
Resource  resource.robot
Suite Setup  Open And Configure Browser
Suite Teardown  Close Browser
Test Setup  Go To Register Page

*** Test Cases ***

Register With Valid Username And Password
    Set Username  palle
    Set Password  palle123
    Set PasswordConfirmation  palle123
    Submit Credentials
    Register Should Succeed

Register With Too Short Username And Valid Password
    Set Username  pa
    Set Password  palle123
    Set PasswordConfirmation  palle123
    Submit Credentials
    Register Should Fail With  Username length must be at least 3

Register With Valid Username And Too Short Password
    Set Username  palle
    Set Password  pa
    Set PasswordConfirmation  pa
    Submit Credentials
    Register Should Fail With  Password length must be at least 3

Register With Nonmatching Password And Password Confirmation
    Set Username  palle
    Set Password  palle123
    Set PasswordConfirmation  pa
    Submit Credentials
    Register Should Fail With  Password and confirmation do not match

Login After Successful Registration
    Set Username  nalle
    Set Password  nalle123
    Set PasswordConfirmation  nalle123
    Submit Credentials

    Go To Login Page
    Set Username  nalle
    Set Password  nalle123
    Submit LoginCredentials
    Login Should Succeed

Login After Failed Registration
    Set Username  falle
    Set Password  falle123
    Set PasswordConfirmation  a
    Submit Credentials

    Go To Login Page
    Set Username  falle
    Set Password  falle123
    Submit LoginCredentials
    Login Should Fail With Message  Invalid username or password

*** Keywords ***
Register Should Succeed
    Welcome Page Should Be Open

Register Should Fail With
    [Arguments]  ${message}
    Register Page Should Be Open
    Page Should Contain   ${message}

Login Should Succeed
    Main Page Should Be Open

Set Username
    [Arguments]  ${username}
    Input Text  username  ${username}

Set Password
    [Arguments]  ${password}
    Input Password  password  ${password}

Set PasswordConfirmation
    [Arguments]  ${password}
    Input Password  password_confirmation  ${password}

Submit Credentials
    Click Button  Register

Submit LoginCredentials
    Click Button  Login

Login Should Fail With Message
    [Arguments]  ${message}
    Login Page Should Be Open
    Page Should Contain  ${message}
