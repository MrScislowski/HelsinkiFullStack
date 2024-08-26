import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteFor(state, action) {
      const chosenEntry = state.find(anecdote => anecdote.id === action.payload)
      chosenEntry.votes++
    },

    newAnecdote(state, action) {
      state.push({ id: getId(), votes: 0, content: action.payload })
    },

    setAnecdotes(state, action) {
      return action.payload
    },
  }
})

export const { voteFor, newAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer