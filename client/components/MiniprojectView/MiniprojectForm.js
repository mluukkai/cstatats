import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { setProject } from 'Utilities/redux/userReducer'
import { clearNotification, setNotification } from 'Utilities/redux/notificationReducer'
import { callApi } from 'Utilities/apiConnection'

const CreateForm = ({ visible, hide, create, formName, formRepository, handleChange }) => visible && (
  <div>
    <h2>register a new miniproject</h2>
    <form>
      <p>
        Use this form to register a new miniproject. Each group should register yourself only once.
        Give the
        {' '}
        <em>miniproject id (that you will get after succesfull registration) to other group members so they can register themselves to the group.</em>
      </p>
      <div>
        <div style={{ display: 'inline-block', width: 150 }}>
          name
        </div>
        <input
          style={{ display: 'inline-block', width: 300 }}
          type="text"
          name="name"
          data-cy="project_name"
          value={formName}
          onChange={handleChange}
        />
      </div>
      <div>
        <div style={{ display: 'inline-block', width: 150 }}>
          github repository
        </div>
        <input
          style={{ display: 'inline-block', width: 300 }}
          type="text"
          name="repository"
          data-cy="project_repository"
          value={formRepository}
          onChange={handleChange}
        />
      </div>
      <div style={{ paddingTop: 10 }}>
        <div style={{ display: 'inline', paddingRight: 5 }}>
          <Button
            color="green"
            disabled={formName.length < 3 || formRepository.length < 6}
            onClick={create}
          >
            register
          </Button>
        </div>
        <div style={{ display: 'inline', paddingRight: 5 }}>
          <Button onClick={hide}>cancel</Button>
        </div>
      </div>

    </form>
  </div>
)

const JoinForm = ({ visible, hide, join, formId, handleChange }) => visible && (
  <div>
    <h2>join to a miniproject</h2>
    <p>
      Use this form to join a miniproject group that has already been registered to the system.
      You get the
      {' '}
      <em>miniproject id</em>
      {' '}
      from the group member who registered your miniproject to the system.
    </p>
    <form>
      <div>
        <div style={{ display: 'inline-block', width: 150 }}>
          miniproject id
        </div>
        <input
          style={{ display: 'inline-block', width: 300 }}
          type="text"
          name="id"
          data-cy="project_id"
          value={formId}
          onChange={handleChange}
        />
      </div>
      <div style={{ paddingTop: 10 }}>
        <div style={{ display: 'inline', paddingRight: 5 }}>
          <Button color="green" onClick={join}>join</Button>
        </div>
        <div style={{ display: 'inline', paddingRight: 5 }}>
          <Button onClick={hide}>cancel</Button>
        </div>
      </div>

    </form>
  </div>
)

const MiniprojectForm = () => {
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))
  const [form, setForm] = useState({ name: '', repository: '', id: '' })
  const [createVisible, setCreateVisible] = useState(false)
  const [joinVisible, setJoinVisible] = useState(false)
  const dispatch = useDispatch()
  if (!user) return null
  if (user.project) return null
  if (user.projectAccepted) return null

  const handleChange = ({ target }) => setForm({ ...form, [target.name]: target.value })

  const joinProject = async () => {
    try {
      const { id } = form
      const response = await callApi(`/projects/${id.trim()}`, 'post')
      const project = response.data
      const newUser = { ...user, project }
      dispatch(setProject(newUser))
      dispatch(setNotification(`you have joined ${project.name}`))
      setTimeout(() => { dispatch(clearNotification()) }, 8000)
    } catch (error) {
      dispatch(setNotification('Failed to join'))
      setTimeout(() => { dispatch(clearNotification()) }, 8000)
    }
  }

  const createProject = async () => {
    const { name, repository } = form
    const payload = {
      name: name.trim(),
      repository: repository.trim(),
      user,
    }

    const courseName = course.info.name
    try {
      const response = await callApi(`/courses/${courseName}/projects`, 'post', payload)
      const newUser = { ...user, project: response.data }
      dispatch(setProject(newUser))
      dispatch(setNotification('miniproject created!'))
      setTimeout(() => { dispatch(clearNotification()) }, 8000)
    } catch (error) {
      dispatch(setNotification(error.response.data.error))
      setTimeout(() => { dispatch(clearNotification()) }, 8000)
    }
  }


  const create = (e) => {
    e.preventDefault()
    createProject()
  }

  const join = (e) => {
    e.preventDefault()
    joinProject()
  }

  return (
    <div>
      {!createVisible && !joinVisible ? (
        <div style={{ paddingTop: 10 }}>
          <div style={{ paddingRight: 5, display: 'inline' }}>
            <Button onClick={() => setCreateVisible(true)}>create miniproject</Button>
          </div>
          <div style={{ paddingRight: 5, display: 'inline' }}>
            <Button onClick={() => setJoinVisible(true)}>join miniproject</Button>
          </div>
        </div>
      ) : null}
      <CreateForm
        visible={createVisible}
        hide={() => setCreateVisible(false)}
        formName={form.name}
        formRepository={form.repository}
        handleChange={handleChange}
        create={create}
      />
      <JoinForm
        visible={joinVisible}
        hide={() => setJoinVisible(false)}
        formId={form.id}
        handleChange={handleChange}
        join={join}
      />
    </div>
  )
}

export default MiniprojectForm
