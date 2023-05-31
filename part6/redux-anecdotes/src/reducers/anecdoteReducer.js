import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"
import { addNotification, clearNotifications } from "./notificationReducer"


const getId = () => (100000 * Math.random()).toFixed(0)

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    addAnecdote(state, action) {
      const newAnecdote = action.payload
      return [
        newAnecdote,
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
      const newState = state.map(anecdote => (anecdote.id === id) ? updatedAnecdote : anecdote)
      newState.sort((a1, a2) => a1.votes - a2.votes)
      return newState
    },

    setAnecdotes(state, action) {
      return action.payload
    }

  }
})

export const { addAnecdote, castVote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer

export const initializeAnecdotesFromDb = () => {
  return async dispatch => {
    const anecdoteList = await anecdoteService.getAnecdotesFromDb()
    dispatch(setAnecdotes(anecdoteList))
  }
}

export const createAnecdote = (text) => {
  const proposedAnecdote = {
    content: text,
    id: getId(),
    votes: 0
  }

  return async dispatch => {
    const createdAnecdote = await anecdoteService.addAnecdoteToDb(proposedAnecdote)
    dispatch(createdAnecdote)
    dispatch(addNotification(`Created anecdote '${createdAnecdote.content}'`))
    setTimeout(() => {dispatch(clearNotifications())}, 5000)
  }
}