import { useDispatch } from "react-redux"
import { newAnecdote } from "../reducers/anecdoteReducer"
import { removeNotification, setNotification } from "../reducers/notificationReducer"
import anecdoteService from "../services/anecdoteService"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = await anecdoteService.postNew(event.target.content.value)
    dispatch(newAnecdote(anecdote))
    dispatch(setNotification(`Created anecdote: "${anecdote.content}"`))
    setTimeout(() => dispatch(removeNotification()), 5000)
    event.target.content.value = ''
  }

  return (
  <>
    <h2>create new</h2>
    <form onSubmit={addAnecdote}>
      <div><input name="content" /></div>
      <button>create</button>
    </form>
  </>
  )
}

export default AnecdoteForm