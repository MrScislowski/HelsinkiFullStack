const initialState = ''

const filterReducer = (state = initialState, action) => {

  switch (action.type) {
    case 'UPDATE_FILTER':
      return action.payload
    default:
      return state
  }
}

export const updateFilter = (newFilterText) => {
  return {
    type: 'UPDATE_FILTER',
    payload: newFilterText
  }
}


export default filterReducer