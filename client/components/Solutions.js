import React from 'react'
import { Grid, Message, List } from 'semantic-ui-react'
import HighLight from 'react-syntax-highlight'
import courseService from 'Services/course'

const File = ({ file, showFile }) => {
  const klik = file => (e) => {
    e.preventDefault()
    showFile(file)
  }

  const handleDot = name => (
    name === '_travis.yml' ? '.travis.yml' : name
  )

  if (file.type === 'file') {
    return (
      <List.Item onClick={klik(file)}>
        <List.Icon name="file" />
        <List.Content>
          <List.Description>{handleDot(file.name)}</List.Description>
        </List.Content>
      </List.Item>
    )
  }
  return (
    <List.Item>
      <List.Icon name="folder" />
      <List.Content>
        <List.Description>{file.name}</List.Description>
        <List>
          {file.files.map(file => (
            <File
              key={file.fullName}
              file={file}
              showFile={showFile}
            />
          ))}
        </List>
      </List.Content>
    </List.Item>
  )
}

class Solutions extends React.Component {
  constructor() {
    super()
    this.state = {
      files: [],
      file: null,
      data: '',
      content: '',
      error: '',
    }
  }

  componentWillMount = async () => {
    const files = await courseService.getSolutions(this.props.course, this.props.id)
    this.setState({ files })
  }

  componentWillReceiveProps = async (newProps) => {
    const files = await courseService.getSolutions(newProps.course, newProps.id)
    this.setState({ files })
  }

  showFile = async (file) => {
    const url = `/${file.fullName}`
    try {
      const { data, content } = await courseService.getFile(url)
      this.setState({ data, content, file })
    } catch (e) {
      this.setState({ error: `Submit part ${this.props.id} first...` })
    }
  }

  render() {
    const show = () => {
      if (this.state.content === 'image/png') {
        const url = `/${this.state.file.fullName}`
        return <img src={url} width="500" />
      }

      if (this.state.content.includes('application/json')) {
        return (
          <HighLight
            lang="json"
            value={JSON.stringify(this.state.data, null, 2)}
          />
        )
      }

      if (this.state.data === undefined || this.state.data.length === 0) {
        return null
      }

      return (
        <HighLight lang="javascript" value={this.state.data} />
      )
    }

    return (
      <div>
        <h2>
Example solutions part
          {this.props.id}
        </h2>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <List>
                {this.state.files.map(file => (
                  <File
                    key={file.fullName}
                    file={file}
                    showFile={this.showFile}
                  />
                ))}
              </List>
            </Grid.Column>

            <Grid.Column width={12}>
              {(this.state.error) && (
                <Message color="red">
                  <Message.Header>
                    no permissions
                  </Message.Header>
                  <p>{this.state.error}</p>
                </Message>
              )}
              <h4>{this.state.file && this.state.file.fullName}</h4>
              {show()}
            </Grid.Column>
          </Grid.Row>
        </Grid>

      </div>
    )
  }
}

export default Solutions
