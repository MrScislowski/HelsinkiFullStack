import { createSlice } from "@reduxjs/toolkit"


const getId = () => (100000 * Math.random()).toFixed(0)

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      return [
        {
          content,
          id: getId(),
          votes: 0
        },
        ...state
      ]
    },

    castVote(state, action) {
      const id = action.payload
      const selectedAnecdote = state.find(anec => anec.id === id)
      const updatedAnecdote = {
        ...selectedAnecdote,
        votes: selectedAnecdote.votes + 1
      } 
      const newState = state.map(anecdote => (anecdote.id === id)? updatedAnecdote : anecdote)
      newState.sort((a1, a2) => a1.votes - a2.votes)
      return newState
    },

    setAnecdotes(state, action) {
      return action.payload
    }

  }
})

export const { createAnecdote, castVote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer