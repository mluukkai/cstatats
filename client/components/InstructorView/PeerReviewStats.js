import React from 'react'
import { Button, Table } from 'semantic-ui-react'

const getUserDisplayName = (user) => {
  if (!user) {
    return ''
  }

  return user.name || user.github || user.username || ''
}

const PeerReviewStat = ({ review, users }) => {
  if (review.type === 'text') {
    return (
      <div style={{ paddingTop: 10 }}>
        <h6>{review.title}</h6>
        <div>
          {users.map((u) => {
            if (!review.answers[u.username]) {
              return null
            }
            return (
              <div key={u.username} style={{ paddingBottom: 10 }}>
                <div>
                  <em>
                    {getUserDisplayName(u)}
                    :
                  </em>
                </div>
                <div>
                  {review.answers[u.username]}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const by = (whom, answers) => {
    const answer = answers.find(a => a.by === whom)

    return answer !== undefined ? answer.score : ''
  }

  const average = (answers, user) => {
    const noMe = Object.values(answers[user]).filter(a => a.by !== user)
    const result = 1.0 * noMe.reduce((s, a) => s + Number(a.score), 0) / (noMe.length)
    return result.toFixed(1)
  }

  return (
    <div style={{ paddingTop: 10 }}>
      <h6>{review.title}</h6>
      <Table>
        <thead>
          <tr>
            <th />
            {users.map(u => (
              <th key={u.username}>
                {getUserDisplayName(u)}
              </th>
            ))}
            <th>
              avg
            </th>
          </tr>
        </thead>
        {users.map(u => (
          <tbody>
            <tr>
              <td>
                {getUserDisplayName(u)}
              </td>
              {users.map(reviewer => (
                <td
                  key={reviewer.username}
                  style={{ fontStyle: reviewer.username === u.username ? 'italic' : '' }}
                >
                  {by(reviewer.username, review.answers[u.username])}
                </td>
              ))}
              <td>
                {average(review.answers, u.username)}
              </td>
            </tr>
          </tbody>
        ))}
      </Table>
    </div>
  )
}

class PeerReviewStats extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
    }
  }

  render() {
    const { peerReviews, peerReviewsGiven } = this.props.project

    if (peerReviewsGiven === 0) {
      return (
        <div>
          no peer reviews given
        </div>
      )
    }

    return (
      <div>
        <Button
          style={{ display: this.state.visible ? 'none' : '' }}
          onClick={() => this.setState({ visible: true })}
        >
          show given
          {' '}
          {peerReviewsGiven}
          {' '}
          peer reviews
        </Button>
        <div style={{ display: this.state.visible ? '' : 'none' }}>
          <h5>Peer revirews</h5>
          <div>
            {peerReviews.map((p, i) => <PeerReviewStat key={i} review={p} users={this.props.project.users} />)}
          </div>
          <Button onClick={() => this.setState({ visible: false })}>
            hide peer reviews
          </Button>
        </div>
      </div>
    )
  }
}

export default PeerReviewStats
