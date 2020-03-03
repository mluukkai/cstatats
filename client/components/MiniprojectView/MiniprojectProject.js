import React from 'react'
import { useSelector } from 'react-redux'

const MiniprojectProject = () => {
  const { user } = useSelector(({ user }) => ({ user }))

  if (user.projectAccepted) {
    const style = { padding: 10 }
    return (
      <div style={style}>
        <em>Projekti hyväksiluettu</em>
      </div>
    )
  }

  if (!user.project || !user.project.users) return null

  return (
    <div>
      <h2>{user.project.name}</h2>

      <div style={{ paddingTop: 4 }}>
        <strong>github</strong>
        {' '}
        <a href={user.project.github}>{user.project.github}</a>
      </div>

      <div style={{ paddingTop: 4 }}>
        <strong>meeting</strong>
        {' '}
        {user.project.meeting ? user.project.meeting : 'not yet time assigned'}
      </div>

      <div style={{ paddingTop: 6 }}>
        <h3>members</h3>
        <ul>
          {user.project.users.map(u => (
            <li key={u.username}>
              {u.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>id</strong>
        {' '}
        <span data-cy="project_id">
          {user.project.id}
        </span>
      </div>
    </div>
  )
}

export default MiniprojectProject
