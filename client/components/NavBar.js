import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { basePath } from 'Utilities/common'
import { logout } from 'Utilities/redux/userReducer'

const CourseRoutes = ({ courseName, submissions, miniprojectEnabled, creditingEnabled, courseAdmin }) => {
  if (!courseName) return null
  return (
    <>
      <Menu.Item
        name="submissions"
        as={NavLink}
        to={`/courses/${courseName}/submissions`}
        content="my submissions"
      />

      {creditingEnabled && !submissions.length && (
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

      {miniprojectEnabled && courseAdmin && (
        <Menu.Item
          name="instructor"
          as={NavLink}
          to={`/courses/${courseName}/instructor`}
          content="instructor"
        />
      )}

      {courseAdmin && (
        <Menu.Item
          name="admin"
          as={NavLink}
          to={`/courses/${courseName}/admin`}
          content="admin"
        />
      )}
    </>
  )
}

const NavBar = ({ location }) => {
  const dispatch = useDispatch()
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))
  if (!user) return null

  const { name } = user

  const courseName = (course.info || {}).name

  const submissions = (user.submissions || []).filter(s => s.courseName === courseName)

  const showCourseRoutes = location.pathname !== '/' && location.pathname !== '/myinfo'
  const courseAdmin = courseName && user.access && (
    user.access.find(access => access.group === courseName || access.group === 'superadmins')
  )
  const miniprojectEnabled = course.info && course.info.miniproject
  const creditingEnabled = course.info && course.info.extension

  const handleLogout = () => {
    localStorage.clear()
    dispatch(logout())
  }

  return (
    <Menu>
      <Menu.Item
        name="stats"
        exact
        as={NavLink}
        to="/"
        content="course stats"
      />
      {user.username && showCourseRoutes && (
        <CourseRoutes
          submissions={submissions}
          courseName={courseName}
          miniprojectEnabled={miniprojectEnabled}
          creditingEnabled={creditingEnabled}
          courseAdmin={courseAdmin}
        />
      )}
      {user.username && (
        <>
          <Menu.Item
            name="name"
            exact
            as={NavLink}
            to="/myinfo"
            content={`${name} - ${user.username}`}
          />
          <Menu.Item
            name="log out"
            onClick={handleLogout}
          >
            log out
          </Menu.Item>
        </>
      )}
      {!user.username && (
        <Menu.Item
          name="loginGithub"
        >
          <a href={`${window.location.origin}${basePath}api/github/auth`}>
            Login Via Github
          </a>
        </Menu.Item>
      )}
    </Menu>
  )
}

export default withRouter(NavBar)
