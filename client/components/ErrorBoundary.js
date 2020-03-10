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
            Something bad happened and we have been notified
          </Message.Header>
          <p>
            You can speed up the fixes by raporting the bug in Telegram (@jakousa or @mluukkai)
            or by email jami.kousa@helsinki.fi
          </p>
        </Message>
      </Container>
    )
  }
}
