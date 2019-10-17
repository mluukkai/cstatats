import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { callApi } from 'Utilities/apiConnection'
import adminService from 'Services/admin'
import Project from 'Components/InstructorView/Project'

const Instructor = ({ course, user }) => {
  const [state, setNewState] = useState({
    projects: [],
    instructorOptions: [],
    showOwn: false,
  })

  const setState = (newStuff) => {
    setNewState({ ...state, ...newStuff })
  }
  const byName = (p1, p2) => (p1.name < p2.name ? -1 : 1)

  useEffect(() => {
    const getAdmins = async () => {
      const admins = await adminService.getAllForCourse(course.info.name)
      setState({ instructorOptions: admins })
    }
    getAdmins()
  }, [course])

  useEffect(() => {
    callApi(`/courses/${course.info.name}/projects`)
      .then((response) => {
        const data = response.data.sort(byName)

        setState({ projects: data })
      }).catch((error) => {
        console.log(error)
      })
  }, [course])

  useEffect(() => {
    callApi(`/courses/${course.info.name}/projects`)
      .then((response) => {
        setState({ projects: response.data.sort(byName) })
      }).catch((error) => {
        console.log(error)
      })
  }, [course])

  const setTime = (id, time) => {
    callApi(`/projects/${id}/meeting`, 'post', { meeting: time })
      .then((response) => {
        const projects = state.projects.filter(p => p._id !== id)
        const changed = state.projects.filter(p => p._id === id)[0]
        changed.meeting = response.data.meeting
        setState({ projects: projects.concat(changed).sort(byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  const deleteTime = (id) => {
    callApi(`/projects/${id}/meeting`, 'delete')
      .then(() => {
        const projects = state.projects.filter(p => p._id !== id)
        const changed = state.projects.filter(p => p._id === id)[0]
        changed.meeting = null
        setState({ projects: projects.concat(changed).sort(byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  const setInstructor = (id, instructor) => {
    callApi(`/projects/${id}/instructor`, 'post', { instructor })
      .then((response) => {
        const projects = state.projects.filter(p => p._id !== id)
        const changed = state.projects.filter(p => p._id === id)[0]
        changed.instructor = response.data.instructor
        setState({ projects: projects.concat(changed).sort(byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  const deleteInstructor = (id) => {
    callApi(`/projects/${id}/instructor`, 'delete')
      .then(() => {
        const projects = state.projects.filter(p => p._id !== id)
        const changed = state.projects.filter(p => p._id === id)[0]
        changed.instructor = null
        setState({ projects: projects.concat(changed).sort(byName) })
      }).catch((error) => {
        console.log(error)
      })
  }

  const check = (e) => {
    setState({ showOwn: e.target.checked })
  }

  const projects = state.showOwn ? state.projects.filter(p => p.instructor === user.username) : state.projects
  return (
    <div>
      <div>
        show only own projects
          {' '}
        <input type="checkbox" onChange={check} />
      </div>
      {projects.map(p => (
        <Project
          key={p._id}
          instructorOptions={state.instructorOptions}
          project={p}
          setTime={setTime}
          deleteTime={deleteTime}
          setInstructor={setInstructor}
          deleteInstructor={deleteInstructor}
        />
      ))}
    </div>
  )
}

const mapStateToProps = ({ user, course }) => ({ user, course })

export default connect(mapStateToProps)(Instructor)
