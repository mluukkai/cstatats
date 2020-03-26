import { useReducer } from 'react'

const SET_ORDER_BY = 'SET_ORDER_BY'

const SET_ORDER_DIRECTION = 'SET_ORDER_DIRECTION'

const reducer = (state, action) => {
  switch(action.type) {
    case SET_ORDER_BY:
      return { ...state, orderBy: action.payload }
    case SET_ORDER_DIRECTION:
      return { ...state, orderDirection: action.payload }
    default:
      return state
  }
}


const useOrderBy = (initialState = {}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const actions = {
    toggleOrderDirection: (orderBy) => {
      if (state.orderBy === orderBy && state.orderDirection) {
        dispatch({
          type: SET_ORDER_DIRECTION,
          payload: state.orderDirection === 'desc' ? 'asc' : 'desc'
        })
      } else {
        dispatch({
          type: SET_ORDER_BY,
          payload: orderBy,
        })

        dispatch({
          type: SET_ORDER_DIRECTION,
          payload: 'asc',
        })
      }
    }
  }

  return [
    state,
    actions,
  ]
}

export default useOrderBy
