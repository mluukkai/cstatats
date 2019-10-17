import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { logout } from 'Utilities/redux/userReducer'

const CourseRoutes = ({ courseName, miniprojectEnabled, creditingEnabled, instructor }) => {
  if (!courseName) return null
  return (
    <>
      <Menu.Item
        name="submissions"
        as={NavLink}
        to={`/courses/${courseName}/submissions`}
        content="my submissions"
      />

      {creditingEnabled && (
        <Menu.Item
          name="crediting"
          as={NavLink}
          to={`/courses/${courseName}/crediting`}
          content="crediting"
        />
      )}

      {miniprojectEnabled && (
        <Menu.Item
          name="miniproject"
          as={NavLink}
          to={`/courses/${courseName}/miniproject`}
          content="miniproject"
        />
      )}

      {miniprojectEnabled && instructor && (
        <Menu.Item
          name="instructor"
          as={NavLink}
          to={`/courses/${courseName}/instructor`}
          content="instructor"
        />
      )}
    </>
  )
}

const NavBar = ({ match }) => {
  const dispatch = useDispatch()
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))
  const name = user
    ? `${user.first_names} ${user.last_name}`
    : ''

  const courseName = (user && course.info && !match.isExact) && course.info.name
  const instructor = course.info && user && user.access && user.access.map(access => access.group).includes(course.info.name)
  const miniprojectEnabled = course.info && course.info.miniproject
  const creditingEnabled = course.info && course.info.extension

  return (
    <Menu>
      <Menu.Item
        name="stats"
        exact
        as={NavLink}
        to="/"
        content="course stats"
      />
      <CourseRoutes
        courseName={courseName}
        miniprojectEnabled={miniprojectEnabled}
        creditingEnabled={creditingEnabled}
        instructor={instructor}
      />
      {user
        && (
          <>
            <Menu.Item name="name" content={name} />
            <Menu.Item
              name="logout"
              onClick={() => dispatch(logout())}
            >
              logout
            </Menu.Item>
          </>
        )
      }
    </Menu>
  )
}

export default withRouter(NavBar)
