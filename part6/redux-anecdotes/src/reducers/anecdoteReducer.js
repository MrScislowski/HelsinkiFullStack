import { createSlice } from '@reduxjs/toolkit'

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
      state.push(action.payload)
    },

    setAnecdotes(state, action) {
      return action.payload
    },
  }
})

export const { voteFor, newAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer