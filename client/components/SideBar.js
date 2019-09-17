import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Sidebar, Segment, Menu, Icon,
} from 'semantic-ui-react'
import { getUserAction } from 'Utilities/redux/userReducer'
import {
  possibleUsers, getHeaders, setHeaders, clearHeaders,
} from 'Utilities/mockHeaders'
import { inProduction } from 'Utilities/common'

const SideBar = ({
  children, visible, hide, username,
}) => {
  const [uid, setUid] = useState(getHeaders().uid)
  const dispatch = useDispatch()
  const handleGetUser = () => dispatch(getUserAction())

  const chooseUser = ({ target }) => {
    setUid(target.id)
    setHeaders(target.id)
    handleGetUser()
  }

  const clearUser = () => {
    setUid(undefined)
    clearHeaders()
    handleGetUser()
  }

  const renderDevMenu = () => {
    if (inProduction) return null

    return (
      <>
        <Menu.Item header>Dev stuff</Menu.Item>
        {possibleUsers.map(u => (
          <Menu.Item key={u.uid} id={u.uid} onClick={chooseUser} disabled={uid === u.uid}>
            {u.uid}
          </Menu.Item>
        ))}
        <Menu.Item onClick={clearUser} disabled={!uid}>
          <Icon name="home" />
          Clear
        </Menu.Item>
      </>
    )
  }

  return (
    <Sidebar.Pushable as={Segment} style={{ height: '100vh' }}>
      <Sidebar
        as={Menu}
        direction="right"
        animation="overlay"
        onHide={hide}
        vertical
        visible={true}
        width="thin"
      >
        <Menu.Item header>{username}</Menu.Item>
        {renderDevMenu()}
      </Sidebar>
      <Sidebar.Pusher>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

export default SideBar
