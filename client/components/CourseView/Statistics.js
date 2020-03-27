import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { Divider } from 'semantic-ui-react'

const Statistics = ({ stats, coursePartCount }) => {
  if (!stats) return null

  const parts = useMemo(() => {
    return Object.keys(stats)
      .map(k => Number(k))
      .slice(0, coursePartCount)
      .reverse()
  }, [stats, coursePartCount])

  const hours = part => (part.hour_total / part.students).toFixed(1)

  const exercises = part => (part.exercise_total / part.students).toFixed(1)

  const style = {
    paddingBottom: 15,
  }

  const chart = p =>
    stats[p].hours
      .slice(1)
      .map((t, i) => ({ name: String(i + 1), students: t || 0 }))

  return (
    <div>
      <h3>Submission statistics</h3>

      {parts.map(p => (
        <div key={p} style={style}>
          <h3>
            part
            {p}
          </h3>
          <table>
            <tbody>
              <tr>
                <td>submissions:</td>
                <td>{stats[p].students}</td>
              </tr>
              <tr>
                <td>hours average:</td>
                <td>{hours(stats[p])}</td>
              </tr>
              <tr>
                <td> exercises average: &nbsp; &nbsp;</td>
                <td>{exercises(stats[p])}</td>
              </tr>
            </tbody>
          </table>

          <h5>used hours</h5>
          <BarChart width={500} height={200} data={chart(p)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#8884d8" />
          </BarChart>

          <Divider />
        </div>
      ))}
    </div>
  )
}

const mapStateToProps = ({ course }) => ({
  stats: course.stats,
  coursePartCount: course.info.exercises ? course.info.exercises.length : 0,
})

export default connect(mapStateToProps)(Statistics)
