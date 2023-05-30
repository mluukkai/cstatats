Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('reset_db', () => {
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
})


Cypress.Commands.add('create_user', (user) => {
  cy.request('POST', 'http://localhost:3003/api/users/', user)
})

Cypress.Commands.add('log_in', (username, password) => {
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('#login-button').click()
})

Cypress.Commands.add('create_blog', ({ title, author, url }) => {
  cy.contains('new note').click()
  cy.get('#title').type(title)
  cy.get('#author').type(author)
  cy.get('#url').type(url)
  cy.contains('create').click()
})