import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { callApi } from 'Utilities/apiConnection'
import adminService from 'Services/admin'
import Project from 'Components/InstructorView/Project'

const Instructor = ({ course, user }) => {
  const [projects, setProjects] = useState([])
  const [instructorOptions, setInstructorOptions] = useState([])
  const [showOwn, setShowOwn] = useState(false)

  const byName = (p1, p2) => p1.name.localeCompare(p2.name)

  useEffect(() => {
    const getAdmins = async () => {
      const admins = await adminService.getAllForCourse(course.info.name)
      setInstructorOptions(admins)
    }
    getAdmins()
  }, [course.info && course.info.name])

  useEffect(() => {
    callApi(`/courses/${course.info.name}/projects`)
      .then((response) => {
        const data = response.data.sort(byName)
        setProjects(data)
      }).catch((error) => {
        console.log(error)
      })
  }, [course])

  const errorCatch = (error) => {
    console.log(error)
  }

  const setTime = (id, time) => {
    callApi(`/projects/${id}/meeting`, 'post', { meeting: time })
      .then((response) => {
        const newProjects = projects.filter(p => p.id !== id)
        const changed = projects.filter(p => p.id === id)[0]
        changed.meeting = response.data.meeting
        setProjects(newProjects.concat(changed).sort(byName))
      }).catch(errorCatch)
  }

  const deleteTime = (id) => {
    callApi(`/projects/${id}/meeting`, 'delete')
      .then(() => {
        const newProjects = projects.filter(p => p.id !== id)
        const changed = projects.filter(p => p.id === id)[0]
        changed.meeting = null
        setProjects(newProjects.concat(changed).sort(byName))
      }).catch(errorCatch)
  }

  const setInstructor = (id, instructor) => {
    callApi(`/projects/${id}/instructor`, 'post', { instructor })
      .then((response) => {
        const newProjects = projects.filter(p => p.id !== id)
        const changed = projects.filter(p => p.id === id)[0]
        changed.instructor = response.data.instructor
        setProjects(newProjects.concat(changed).sort(byName))
      }).catch(errorCatch)
  }

  const deleteInstructor = (id) => {
    callApi(`/projects/${id}/instructor`, 'delete')
      .then(() => {
        const newProjects = projects.filter(p => p.id !== id)
        const changed = projects.filter(p => p.id === id)[0]
        changed.instructor = null
        setProjects(newProjects.concat(changed).sort(byName))
      }).catch(errorCatch)
  }

  const deleteProject = (id) => {
    callApi(`/projects/${id}`, 'delete')
      .then(() => {
        const newProjects = projects.filter(p => p.id !== id)
        setProjects(newProjects.sort(byName))
      }).catch(errorCatch)
  }

  const check = ({ target }) => setShowOwn(target.checked)

  const displayProjects = showOwn ? projects.filter(p => p.instructor === user.username) : projects

  return (
    <div>
      <div>
        show only own projects
        {' '}
        <input type="checkbox" onChange={check} />
      </div>
      {displayProjects.map(p => (
        <Project
          key={p.id}
          instructorOptions={instructorOptions}
          project={p}
          deleteProject={deleteProject}
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
