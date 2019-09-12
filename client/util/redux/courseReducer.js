const initial = {
  info: null,
  stats: null
}

const reducer = (state = initial, action) => {
  if (action.type === 'INITIALIZE_COURSE') {
    return Object.assign({}, state, {info: action.payload } )
  }

  if (action.type === 'INITIALIZE_STATS') {
    return Object.assign({}, state, { stats: action.payload })
  }

  return state
}

export const initializeCourse = (data) => {
  return {
    type: 'INITIALIZE_COURSE',
    payload: data
  }
}

export const initializeStats = (data) => {
  return {
    type: 'INITIALIZE_STATS',
    payload: data
  }
}

export default reducer