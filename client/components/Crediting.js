import React from 'react'
import { Form, Input, Dropdown, Table, Button } from 'semantic-ui-react'
import { initializeCourse } from 'Utilities/redux/courseReducer'
import courseService from 'Services/course'

class Crediting extends React.Component{
  componentWillMount = async () => {
    const info = await courseService.getInfoOf(this.props.course)
    this.props.store.dispatch(initializeCourse(info))
  }

  state = {
    github: '',
    to: '',
    from: ''
  }

  handleChange = (e) => {
    let value = e.target.name[0] === 'e' ? e.target.checked : e.target.value
    this.setState({ [e.target.name]: value })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const ok = window.confirm(`Are you absolutely sure that you gave the right info? `)
    if (ok) {
      this.props.createCrediting(this.state)
    }
  }

  handleTo = (e) => {
    this.setState({ to: e.target.innerText })
  }

  handleFrom = (e) => {
    this.setState({ from: e.target.innerText.split(':')[0] })
  }

  formValid() {
    const valid = this.state.github.length > 2 &&
      !this.state.github.includes('/') &&
      this.state.from.length > 1 &&
      this.state.to.length > 0

    return valid
  }   

  render() {
    if (!this.props.user) {
      return null
    }

    const extension = this.props.user.extensions && this.props.user.extensions.find(e => e.to === this.props.course)

    if (extension) {
      const submissions = extension.extendsWith
      const total = submissions.reduce((s,e)=>s+e.exercises,0)

      return <div>
        <h2>Crediting</h2>

        <em>Credited the following parts from course {extension.from}</em>

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>part</Table.HeaderCell>
              <Table.HeaderCell>exercises</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {submissions.map(s => (
              <Table.Row key={s.part}>
                <Table.Cell>{s.part}</Table.Cell>
                <Table.Cell>{s.exercises}</Table.Cell>
              </Table.Row>)
            )}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>total</Table.HeaderCell>
              <Table.HeaderCell>{total}</Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>

      </div>
    }

    const stateOptions = [ 
      { key: '0', value: '0', text: '0' },
      { key: '1', value: '1', text: '1' },
      { key: '2', value: '2', text: '2' },
      { key: '3', value: '3', text: '3' },
      { key: '4', value: '4', text: '4' },
      { key: '5', value: '5', text: '5' },
      { key: '6', value: '6', text: '6' }
    ]
    const courseOptions  = [
      {
        key: 'fullstackopen2018', 
        value: 'fullstackopen2018',
        text: 'fullstackopen2018: Open university course'
      },
      {
        key: 'fullstack 2018',
        value: 'fullstack2018',
        text: 'fullstack2018: Department of CS course'
      }
    ]

    return (
      <div>
        <h2>Crediting a previous course (hyväksiluku)</h2>
        <p>Täytä allaoleva lomake ainoastaan, jos aiot tällä kurssilla täydentää aiempaa kurssisuoritustasi.</p>

        <p>
          Hyväksiluvusta lisää <a href='https://fullstack-hy2019.github.io/osa0/yleista#aiemmin-suoritetun-kurssin-taydentaminen'>kurssisivulta</a>.
        </p>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field inline>
            <label>From course</label>
            <Dropdown
              inline
              options={courseOptions}
              value={this.state.from}
              name="from"
              onChange={this.handleFrom}
            />
          </Form.Field>

          <Form.Field inline>
            <label>Parts from 0 to</label>
            <Dropdown        
              inline
              options={stateOptions}
              value={this.state.to}
              name="to"
              onChange={this.handleTo}
            />
          </Form.Field>

          <Form.Field inline>
            <label>Github account</label>
            <Input
              type='text'
              value={this.state.github}
              name="github"
              onChange={this.handleChange}
            />
          </Form.Field>

          <Button
            disabled={!this.formValid()}
          >
          submit</Button>
        </Form>
      </div>
    )
  }
}

export default Crediting