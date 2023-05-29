import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const vote = (id) => {
    // console.log('vote', id)
    dispatch({
      type: 'VOTE',
      payload: { id }
    })
  }

  const createNewAnecdote = (event) => {
    event.preventDefault()
    const anecdoteText = event.target.anecdoteTextInput.value
    event.target.anecdoteTextInput.value = ''

    dispatch({
      type: 'CREATE',
      payload: { anecdoteText }
    })
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
            <button onClick={() => vote(anecdote.id)}>vote</button>
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