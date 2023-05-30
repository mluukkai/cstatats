import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    notifyWith(state, { payload }) {
      return payload
    },
  },
})

export const setNotification = (notification) => {
  return async (dispatch) => {
    dispatch(notifyWith(notification))
    setTimeout(() => {
      dispatch(notifyWith(null))
    }, 5000)
  }
}

const { notifyWith } = slice.actions
export default slice.reducer
