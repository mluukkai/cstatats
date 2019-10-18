import React, { useState } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import PeerReviewStats from 'Components/InstructorView/PeerReviewStats'

const Project = ({ project, instructorOptions, setTime, deleteTime, setInstructor, deleteInstructor }) => {
  const [formVisible, setFormVisible] = useState(false)
  const [instructorFormVisible, setInstructorFormVisible] = useState(false)
  const [newTime, setNewTime] = useState('')
  const [newInstructor, setNewInstructor] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setTime(project._id, newTime)
  }

  const onInstructorSubmit = (e) => {
    e.preventDefault()
    setInstructor(project._id, newInstructor)
  }

  const onInstructorChange = (e) => {
    e.preventDefault()
    setNewInstructor(e.target.value)
  }

  const onDeleteTime = () => {
    const ok = confirm('are you sure?')
    if (ok) {
      deleteTime(project._id)
    }
  }

  const onDeleteInstructor = () => {
    const ok = confirm('are you sure?')
    if (ok) {
      deleteInstructor(project._id)
    }
  }

  const onChange = (e) => {
    e.preventDefault()
    setNewTime(e.target.value)
  }

  const instructor = () => {
    const options = instructorOptions
    const buttonStyle = {
      display: instructorFormVisible ? 'none' : '',
    }

    const formStyle = {
      display: instructorFormVisible ? '' : 'none',
    }

    if (project.instructor) {
      return (
        <span>
          <strong>instructor</strong>
          {' '}
          {project.instructor}
          <span onClick={onDeleteInstructor}>
            <Icon name="trash" />
          </span>
        </span>
      )
    }

    return (
      <div>
        <div style={buttonStyle}>
          <Button onClick={() => setInstructorFormVisible(true)}>set instructor</Button>
        </div>
        <div style={formStyle}>
          <form onSubmit={onInstructorSubmit}>
            <div style={{ paddingTop: 5, paddingBottom: 5 }}>
              <select name="instructor" onChange={onInstructorChange}>
                <option>--</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <Button
              type="submit"
              color="green"
              disabled={newInstructor.length < 3}
            >
              set instructor
            </Button>
            <span style={{ paddingLeft: 5 }}>
              <Button type="button" onClick={() => setInstructorFormVisible(false)}>cancel</Button>
            </span>
          </form>
        </div>
      </div>
    )
  }

  const meeting = () => {
    const buttonStyle = {
      display: formVisible ? 'none' : '',
    }

    const formStyle = {
      display: formVisible ? '' : 'none',
    }

    if (!project.meeting) {
      return (
        <div>
          <div style={buttonStyle}>
            <Button onClick={() => setFormVisible(true)}>set time for meeting</Button>
          </div>
          <div style={formStyle}>
            <form onSubmit={onSubmit}>
              <div style={{ paddingBottom: 5 }}>
                <input
                  onChange={onChange}
                  placeholder="eg. ti 10.30 A340"
                  name="time"
                  value={newTime}
                />
              </div>
              <Button
                type="submit"
                color="green"
                disabled={newTime.length < 5}
              >
                set time
              </Button>
              <span style={{ paddingLeft: 5 }}>
                <Button type="button" onClick={() => setFormVisible(false)}>cancel</Button>
              </span>
            </form>
          </div>
        </div>
      )
    }

    return (
      <span>
        <strong>meetings</strong>
        {' '}
        {project.meeting}
        <span
          onClick={onDeleteTime}
        >
          <Icon name="trash" />
        </span>
      </span>
    )
  }

  const style = { paddingTop: 10 }
  const smallPadding = { paddingTop: 5 }

  return (
    <div style={style}>
      <div className="ui divider" />
      <h4>{project.name}</h4>
      <div style={smallPadding}>
        <em>
          <strong>id</strong>
          {' '}
          {project._id}
        </em>
      </div>
      <div style={smallPadding}>
        <a href={project.github}>{project.github}</a>
      </div>
      <div style={smallPadding}>
        {meeting()}
      </div>
      <div style={smallPadding}>
        {instructor()}
      </div>

      <div style={style}>
        <h5>Students</h5>
        <ul style={style}>
          {project.users.map((u, i) => (
            <li key={i}>
              {u.last_name}
              {' '}
              {u.first_names}
              {' '}
              <a href={`https://github.com/${u.github}`}>{u.github}</a>
            </li>
          ))}
        </ul>
      </div>
      <PeerReviewStats project={project} />
    </div>
  )
}

export default Project
