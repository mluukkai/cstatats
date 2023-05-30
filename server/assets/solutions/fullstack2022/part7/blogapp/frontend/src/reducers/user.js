import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    loginUser(state, { payload }) {
      return payload
    },
    // eslint-disable-next-line no-unused-vars
    logoutUser(state, { payload }) {
      return null
    },
  },
})

export const { loginUser, logoutUser } = slice.actions
export default slice.reducer
