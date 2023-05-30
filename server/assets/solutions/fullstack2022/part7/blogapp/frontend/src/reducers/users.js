import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    initializeWith(state, { payload }) {
      return payload
    },
  },
})

export const initializeUsers = () => {
  return async (dispatch) => {
    userService.getAll().then((response) => {
      dispatch(initializeWith(response))
    })
  }
}

const { initializeWith } = slice.actions
export default slice.reducer
