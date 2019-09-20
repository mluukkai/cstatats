import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { logout } from 'Utilities/redux/userReducer'

const NavBar = () => {
  const dispatch = useDispatch()
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))
  const instructor = () => user && ['laatopi', 'mluukkai', 'kalleilv', 'nikoniko'].includes(user.username)
  const name = user
    ? `${user.first_names} ${user.last_name}`
    : ''
  const loggedInCourse = () => {
    if (!user) return false

    const url = document.location.href
    const h = url.indexOf('#')
    return h !== -1 && url.substring(h).length > 2
  }

  const miniprojectEnabled = () => course.info && course.info.miniproject
  const creditingEnabled = () => course.info && course.info.extension

  return (
    <Menu>
      <Menu.Item
        name="stats"
        exact
        as={NavLink}
        to="/"
        content="course stats"
      />

      {loggedInCourse()
        && (
          <Menu.Item
            name="submissions"
            as={NavLink}
            to={`/courses/${course.info.name}/submissions`}    
            content="my submissions"
          />
        )
      }

      {loggedInCourse() && creditingEnabled()
        && (
          <Menu.Item
            name="crediting"
            as={NavLink}
            to={`/courses/${course.info.name}/crediting`}
            content="crediting"
          />
        )
      }

      {loggedInCourse() && miniprojectEnabled()
        && (
          <Menu.Item
            name="miniproject"
            as={NavLink}
            to={`/courses/${course.info.name}/miniproject`}
            content="miniproject"
          />
        )
      }

      {loggedInCourse() && miniprojectEnabled() && instructor()
        && (
          <Menu.Item
            name="instructor"
            as={NavLink}
            to={`/courses/${course.info.name}/instructor`}
            content="instructor"
          />
        )
      }
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

export default NavBar
