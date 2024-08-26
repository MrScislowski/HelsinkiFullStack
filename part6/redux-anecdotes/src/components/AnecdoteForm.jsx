import { useDispatch } from "react-redux"
import { createNewAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    dispatch(createNewAnecdote(event.target.content.value))
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