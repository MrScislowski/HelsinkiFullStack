import { useSelector, useDispatch } from 'react-redux'
import { castVote, createAnecdote } from './reducers/anecdoteReducer'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const createNewAnecdote = (event) => {
    event.preventDefault()
    const anecdoteText = event.target.anecdoteTextInput.value
    event.target.anecdoteTextInput.value = ''

    dispatch(createAnecdote)
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(castVote(anecdote.id))}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={(event) => createNewAnecdote(event)}>
        <div><input name="anecdoteTextInput"/></div>
        <button>create</button>
      </form>
    </div>
  )
}

export default App