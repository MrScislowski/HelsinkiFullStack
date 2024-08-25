const initialState = ''


export const setFilter = (text) => {
  return {
    type: 'SET_FILTER',
    payload: text
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER': {
      return action.payload
    }
    default:
      return state
  }
}

export default reducer