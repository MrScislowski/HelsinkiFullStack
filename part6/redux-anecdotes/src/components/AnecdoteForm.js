import { createAnecdote } from "../reducers/anecdoteReducer"
import { addNotification, clearNotifications } from "../reducers/notificationReducer"
import { useDispatch } from "react-redux"


const AnecdoteForm = (props) => {
    const dispatch = useDispatch()

    const createNewAnecdote = (event) => {
        event.preventDefault()
        const anecdoteText = event.target.anecdoteTextInput.value
        event.target.anecdoteTextInput.value = ''
    
        dispatch(createAnecdote(anecdoteText))
        dispatch(addNotification(`Created anecdote '${anecdoteText}'`))
        setTimeout(() => {dispatch(clearNotifications())}, 5000)
    }
  
    return (
    <>
    <h2>create new</h2>
      <form onSubmit={(event) => createNewAnecdote(event)}>
        <div><input name="anecdoteTextInput"/></div>
        <button>create</button>
      </form>
    </>
    )
}

export default AnecdoteForm