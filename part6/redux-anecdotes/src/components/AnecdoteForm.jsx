import { useDispatch } from "react-redux"
import { newAnecdote } from "../reducers/anecdoteReducer"
import { removeNotification, setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    dispatch(newAnecdote(event.target.content.value))
    dispatch(setNotification(`Created anecdote: "${event.target.content.value}"`))
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