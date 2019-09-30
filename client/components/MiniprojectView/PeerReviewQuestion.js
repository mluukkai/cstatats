import React from 'react'

class PeerReviewQuestion extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const [question, target] = e.target.name.split(' ')
    const value = e.target.value

    this.props.onRadioChange({ question, target, value })
  }

  render() {
    const q = this.props.question

    const questionStyle = {
      paddingTop: 5,
      paddingLeft: 5,
      paddingBottom: 5,
      borderStyle: 'solid',
      marginTop: 10,
      borderWidth: 1,
      borderRadius: 5,
    }

    if (q.type === 'rating') {
      const nameStyle = { display: 'inline-block', width: 300 }
      const radioStyle = { width: 50 }
      return (
        <div style={questionStyle}>
          <div>
            <strong>
              {q.title}
            </strong>
          </div>
          <div style={{ paddingTop: 2 }}>
            <em>
              {q.description}
            </em>
          </div>
          <div style={{ paddingTop: 2 }}>
            {q.scale}
          </div>
          <table>
            <tbody>
              <tr>
                <td />
                <td>0</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
              </tr>
              {this.props.users.map(u => (
                <tr key={u.username}>
                  <td style={nameStyle}>
                    {u.last_name}
                    {' '}
                    {u.first_names}
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="0" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="1" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="2" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="3" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="4" />
                  </td>
                  <td style={radioStyle}>
                    <input onChange={this.onChange} type="radio" name={`${q.id} ${u.username}`} value="5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    if (q.type === 'inline') {
      const style = { display: 'inline-block', width: 200, paddingLeft: 5 }
      return (
        <div style={questionStyle}>
          <div style={style}>
            <strong>
              {q.title}
            </strong>
          </div>
          <div style={style}>
            <input
              onChange={this.props.onChange}
              name={q.id}
            />
          </div>
        </div>
      )
    }

    return (
      <div style={questionStyle}>
        <strong>
          {q.title}
        </strong>
        <div>
          <em>
            {q.description}
          </em>
        </div>
        <div>
          <textarea
            style={{ width: '99%', height: 200 }}
            onChange={this.props.onChange}
            name={q.id}
          />
        </div>
      </div>
    )
  }
}

export default PeerReviewQuestion
