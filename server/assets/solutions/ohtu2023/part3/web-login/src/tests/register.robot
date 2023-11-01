*** Settings ***
Resource  resource.robot
Suite Setup  Open And Configure Browser
Suite Teardown  Close Browser
Test Setup  Go To Register Page

*** Test Cases ***
Register With Valid Username And Password
    Set Username  kalle
    Set Password  kalle123
    Set PasswordConfirmation  kalle123
    Submit New User
    User Creation Should Succeed

Register With Too Short Username And Valid Password
    Set Username  ka
    Set Password  kalle123
    Set PasswordConfirmation  kalle123
    Submit New User
    User Creation Should Fail With  Invalid username: should have length 3 or more

Register With Valid Username And Invalid Password
    Set Username  kalle
    Set Password  kallekal
    Set PasswordConfirmation  kallekal
    Submit New User
    User Creation Should Fail With  Invalid password: should not only contain letters

Register With Nonmatching Password And Password Confirmation
    Set Username  kalle
    Set Password  kalleka1
    Set PasswordConfirmation  kalleka2
    Submit New User
    User Creation Should Fail With  Invalid password: password and the confirmation do not match

Login After Successful Registration
    Set Username  kalle
    Set Password  kalle123
    Set PasswordConfirmation  kalle123
    Submit New User
    Go To Login Page
    Set Username  kalle
    Set Password  kalle123
    Submit Credentials
    Login Should Succeed

Login After UnSuccessful Registration
    Set Username  ka
    Set Password  kalle123
    Set PasswordConfirmation  kalle123
    Submit New User
    Go To Login Page
    Set Username  ka
    Set Password  kalle123
    Submit Credentials
    Login Should Fail With Message  Invalid username or password


*** Keywords ***
Submit New User
    Click Button  Register

User Creation Should Succeed
    Title Should Be  Welcome to Ohtu Application!

User Creation Should Fail With
    [Arguments]  ${message}
    Page Should Contain  ${message}