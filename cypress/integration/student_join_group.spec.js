const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const getToken = (secret, username = 'admin') => jwt.sign({ username, name: `Testi ${username}`, email: `${username}@heelsinki.fi` }, secret)

context('Student', () => {
  let adminToken
  let studentToken
  let student2Token
  let courseName
  let courseFullName

  before(() => {
    const token_secret = Cypress.env('JWT_SECRET')
    adminToken = getToken(token_secret)
    studentToken = getToken(token_secret, `new_student_${uuid()}`)
    student2Token = getToken(token_secret, `new_student_${uuid()}`)
    courseName = `testi_ohtu_${uuid()}`
    courseFullName = `Testailua cypressillä ${courseName}`
  })

  describe('Can join a miniproject', () => {
    let projectName
    let projectId

    before(() => {
      projectName = `project_${uuid()}`
      // Create course
      localStorage.setItem('token', adminToken)
      cy.visit('http://localhost:8000/luukkainen')
      cy.contains('admin')
      cy.get('[data-cy=course_name]').type(courseName)
      cy.get('[data-cy=course_full_name]').type(courseFullName)
      cy.get('[data-cy=course_url]').type('https://google.fi')
      cy.get('[data-cy=course_term]').type('syksy')
      cy.get('[data-cy=course_year]').type('2020')

      cy.get('[data-cy=add_week]').click()
      cy.get('[data-cy=add_week]').click()
      cy.get('[data-cy=remove_week]').click()
      cy.get('[data-cy=add_week]').click()
      cy.get('[data-cy=add_week]').click()
      cy.get('[data-cy=add_week]').click()
      cy.get('[data-cy=remove_week]').click()

      cy.get('[data-cy=course_week_1]').type('5')
      cy.get('[data-cy=course_week_2]').type('3')

      cy.get('[data-cy=course_enable]').click()
      cy.get('[data-cy=miniproject_enable]').click()
      cy.get('[data-cy=peer_review_enable]').click()
      cy.contains('Submit').click()

      cy.contains(courseName)
    })

    it('can create a group', () => {
      // Create miniproject
      localStorage.setItem('token', studentToken)
      cy.visit('http://localhost:8000')
      cy.contains(courseFullName).click()
      cy.contains('miniproject').click()
      cy.contains('create miniproject').click()
      cy.get('[data-cy=project_name]').type(projectName)
      cy.get('[data-cy=project_repository]').type('https://github.com/UniversityOfHelsinkiCS')
      cy.get('button').contains('register').click()
      cy.get('[data-cy=project_id]').invoke('text').then(text => projectId = text)
    })
    describe('Student', () => {
      it('can join a group', () => {
        localStorage.setItem('token', student2Token)
        cy.visit('http://localhost:8000')
        cy.contains(courseFullName).click()
        cy.contains('miniproject').click()
        cy.contains('join miniproject').click()
        cy.get('[data-cy=project_id]').type(projectId)
        cy.get('button').contains('join').click()
        cy.get('ul li').its('length').should('be', 2)
      })
    })
  })
})
