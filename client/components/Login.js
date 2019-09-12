import React from 'react'
import { connect } from 'react-redux'

import { Modal, Header, Button, Form, Message } from 'semantic-ui-react'

class Login extends React.Component {
  constructor() {
    super()
    this.state = { 
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value})
  }

  handleOpen = () => this.props.handleOpen()

  handleClose = () => {
    this.props.handleClose(this.state.username, this.state.password)
  }

  render() {
    const error = () => {
      if (this.props.notification === null || this.props.notification.type !== 'loginError' ) {
        return null
      }

      const style = {
        margin: 10,
        color: 'red',
      }

      return (
        <Message color={'red'}>
          {this.props.notification.text}
        </Message>
      )
      
    }

    return(
      <Modal
        open={this.props.open}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Modal.Content>
          <h3>Give your university AD credentials</h3>
          {error()}
          <Form>
            <Form.Field>
              <label>username</label>
              <input 
                placeholder='username' 
                name='username'
                value={this.state.username}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>password</label>
              <input
                placeholder='password'
                type='password'
                name='password'
                value={this.state.password}
                onChange={this.handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleClose} inverted>
            Submit
              </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Login)