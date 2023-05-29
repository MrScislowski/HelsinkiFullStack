const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  // console.log('state now: ', state)
  // console.log('action', action)

  let newState = {}
  switch (action.type) {
    case 'VOTE':
      const id = action.payload.id

      const selectedAnecdote = state.find(anec => anec.id === id)
      const updatedAnecdote = {
        ...selectedAnecdote,
        votes: selectedAnecdote.votes + 1
      } 
      newState = state.map(anecdote => (anecdote.id === id)? updatedAnecdote : anecdote).sort()
      newState.sort((a1, a2) => a1.votes - a2.votes)
      return newState
    
    case 'CREATE':
      newState = [
        {
          content: action.payload.anecdoteText,
          id: getId(),
          votes: 0
        },
        ...state,
      ]
      return newState

    default:
      return state
  }
}

export default reducer