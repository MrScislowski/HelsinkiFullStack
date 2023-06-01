import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery } from 'react-query'
import axios from 'axios'

const App = () => {

  const handleVote = (anecdote) => {
    console.log('vote')
  }

  const anecdotesQuery = useQuery({
    queryKey: 'anecdotes',
    queryFn: () => axios.get('http://localhost:3001/anecdotes').then(res => res.data),
    retry: 1
  })

  //   'anecdotes',
  //   () => axios.get('http://localhost:3001/anecdotes').then(res => res.data)
  // )

  if (anecdotesQuery.isLoading) {
    return <div>Loading data...</div>
  }

  if (anecdotesQuery.isError) {
    return <div>anecdote service not available due to server problems</div>
  }

  const anecdotes = anecdotesQuery.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
