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

    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload
      const id = updatedAnecdote.id
      
      const newState = state.map(anecdote => (anecdote.id === id) ? updatedAnecdote : anecdote)
      return newState
    },

    setAnecdotes(state, action) {
      return action.payload
    }

  }
})

export const { addAnecdote, updateAnecdote, setAnecdotes } = anecdoteSlice.actions
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

    dispatch(addAnecdote(createdAnecdote))
    dispatch(addNotification(`Created anecdote '${createdAnecdote.content}'`))
    setTimeout(() => {dispatch(clearNotifications())}, 5000)
  }
}

export const castVote = (id) => {

  return async (dispatch, getState) => {
    const selectedAnecdote = getState().anecdotes.find(anec => anec.id === id)
    const localUpdatedAnecdote = {
      ...selectedAnecdote,
      votes: selectedAnecdote.votes + 1
    }
    const updatedAnecdote = await anecdoteService.updateAnecdote(localUpdatedAnecdote)
    dispatch(updateAnecdote(updatedAnecdote))
    dispatch(addNotification(`You voted '${updatedAnecdote.content}'`))
    setTimeout(() => {
      dispatch(clearNotifications())
    }, 5000)
  }

}