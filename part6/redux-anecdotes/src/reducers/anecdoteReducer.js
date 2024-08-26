import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'
import { setNotification, removeNotification } from './notificationReducer'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    replaceAnecdote(state, action) {
      const newState = state.map(anecdote => {
        return (
          anecdote.id !== action.payload.id
          ? anecdote
          : action.payload
        )
      })
      console.log(`new state is: ${JSON.stringify(newState, null, 2)}`)
    },

    newAnecdote(state, action) {
      state.push(action.payload)
    },

    setAnecdotes(state, action) {
      return action.payload
    },
  }
})

export const { replaceAnecdote, newAnecdote, setAnecdotes } = anecdoteSlice.actions

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

export const voteForAnecdote = (id) => {
  return async (dispatch, getState) => {
    const chosenAnecdote = getState().anecdotes.find(a => a.id === id)
    const proposedAnecdote = {
      ...chosenAnecdote,
      votes: chosenAnecdote.votes + 1,
    }
    const updatedAnecdote = await anecdoteService.update(proposedAnecdote)
    dispatch (replaceAnecdote(updatedAnecdote))
    dispatch(setNotification(`Voted for "${updatedAnecdote.content}"`))
    setTimeout(() => dispatch(removeNotification()), 5000)
  }
}

export default anecdoteSlice.reducer