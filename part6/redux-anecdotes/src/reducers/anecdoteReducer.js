import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'
import { setNotification, removeNotification } from './notificationReducer'

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

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const data = await anecdoteService.getAll()
    dispatch(setAnecdotes(data))
  }
}

export const createNewAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.postNew(content)
    dispatch(newAnecdote(anecdote))
    dispatch(setNotification(`Created anecdote: "${anecdote.content}"`))
    setTimeout(() => dispatch(removeNotification()), 5000)
  }
}

export default anecdoteSlice.reducer