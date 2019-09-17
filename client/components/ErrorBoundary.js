import React, { Component } from 'react'
import {
  Container, Message,
} from 'semantic-ui-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.setState({ hasError: true })
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props
    if (!hasError) {
      return children
    }

    return (
      <Container style={{ margin: 10 }}>
        <Message color="red">
          <Message.Header>
            Something bad happened
          </Message.Header>
          <p>
            raport bug in Telegram or by email mluukkai@cs.helsinki.fi
          </p>
        </Message>
      </Container>
    )
  }
}
