*** Settings ***
Resource  resource.robot

*** Test Cases ***
Reset Counter After One Increment
    Counter Value Should Be  0
    Increase Counter
    Counter Value Should Be  1
    Reset Counter
    Counter Value Should Be  0

Reset Counter After Several Increments
    Counter Value Should Be  0
    Increment Counter By  5
    Counter Value Should Be  5
    Reset Counter
    Counter Value Should Be  0