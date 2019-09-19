import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { logout } from 'Utilities/redux/userReducer'

const NavBar = ({ history }) => {
  const [activeItem, setActiveItem] = useState()
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

  const handleItemClick = history => (e, { name }) => {
    const courseName = course.info.name
    if (name === 'submissions') {
      history.push(`/courses/${courseName}/submissions`)
    } else if (name === 'miniproject') {
      history.push(`/courses/${courseName}/miniproject`)
    } else if (name === 'crediting') {
      history.push(`/courses/${courseName}/crediting`)
    } else if (name === 'instructor') {
      history.push(`/courses/${courseName}/instructor`)
    } else {
      history.push(`/courses/${courseName}`)
    }

    setActiveItem(name)
  }

  return (
    <Menu>
      <Menu.Item
        name="stats"
        active={activeItem === 'stats'}
        onClick={handleItemClick(history)}
      >
        course stats
      </Menu.Item>

      {loggedInCourse()
        && (
          <Menu.Item
            name="submissions"
            active={activeItem === 'submissions'}
            onClick={handleItemClick(history)}
          >
            my submissions
          </Menu.Item>
        )
      }

      {loggedInCourse() && creditingEnabled()
        && (
          <Menu.Item
            name="crediting"
            active={activeItem === 'crediting'}
            onClick={handleItemClick(history)}
          >
            crediting
          </Menu.Item>
        )
      }

      {loggedInCourse() && miniprojectEnabled()
        && (
          <Menu.Item
            name="miniproject"
            active={activeItem === 'miniproject'}
            onClick={handleItemClick(history)}
          >
            miniproject
          </Menu.Item>
        )
      }

      {loggedInCourse() && miniprojectEnabled() && instructor()
        && (
          <Menu.Item
            name="instructor"
            active={activeItem === 'instructor'}
            onClick={handleItemClick(history)}
          >
            instructor
          </Menu.Item>
        )
      }
      {user
        && (
          <>
            <Menu.Item
              name="name"
            >
              <em>
                {name}
              </em>
            </Menu.Item>
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
