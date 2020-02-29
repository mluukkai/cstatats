import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import { callApi } from 'Utilities/apiConnection'
import { getUserAction } from 'Utilities/redux/userReducer'

const GithubTokenConsumer = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [fetched, setFetched] = useState(false)

  const getToken = async () => {
    const { token } = queryString.parse(location.search)
    if (!token || fetched) return

    const { data } = await callApi(`/github/get_token?token=${token}`)
    localStorage.setItem('token', data.token)
    setFetched(true)
    dispatch(getUserAction())
  }

  useEffect(() => {
    getToken()
  }, [location.search])

  return null
}

export default GithubTokenConsumer
