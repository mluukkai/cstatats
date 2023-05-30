*** Settings ***
Resource  resource.robot
Suite Setup  Open And Configure Browser
Suite Teardown  Close Browser
Test Setup  Go To Register Page

*** Test Cases ***
Register With Valid Username And Password
    Set Username  kalle
    Set Password  kalle123
    Set Password_Confirmation  kalle123
    Submit Info
    Registration Should Succeed

Register With Too Short Username And Valid Password
    Set Username  cal
    Set Password  kalle123
    Set Password_Confirmation  kalle123
    Submit Info
    Registration Should Fail With  Username too short

Register With Valid Username And Too Short Password
    Set Username  kalle
    Set Password  kalle
    Set Password_Confirmation  kalle
    Submit Info
    Registration Should Fail With  Password not valid

Register With Nonmatching Password And Password Confirmation
    Set Username  kalle
    Set Password  kalle123
    Set Password_Confirmation  kalle111
    Submit Info
    Registration Should Fail With  Password and confirmation do not match

Login After Successful Registration
    Set Username  kalle
    Set Password  kalle123
    Set Password_Confirmation  kalle123
    Submit Info
    Go To Login Page
    Set Username  kalle
    Set Password  kalle123
    Submit Credentials
    Login Should Succeed

Login After Failed Registration
    Set Username  cal
    Set Password  kalle123
    Set Password_Confirmation  kalle123
    Submit Info
    Go To Login Page
    Set Username  cal
    Set Password  kalle123
    Submit Credentials
    Login Should Fail With Message  Invalid username or password

*** Keywords ***
Submit Info
    Click Button  Register

Registration Should Succeed
    Welcome Page Should Be Open

Registration Should Fail With
    [Arguments]  ${message}
    Register Page Should Be Open
    Page Should Contain  ${message}