import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import { useQuery, useQueryClient, useMutation } from 'react-query'

const App = () => {
  const queryClient = useQueryClient()

  const voteOnDb = (anecdote) => {
    return updateAnecdote({...anecdote, votes: anecdote.votes + 1})
  }

  const voteMutation = useMutation(voteOnDb, {
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData('anecdotes', 
        queryClient.getQueryData('anecdotes').map(an => (an.id === updatedAnecdote.id)? updatedAnecdote : an))
    }
  })

  const anecdotesQuery = useQuery({
    queryKey: 'anecdotes',
    queryFn: () => getAnecdotes(),
    retry: 1
  })

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
            <button onClick={() => voteMutation.mutate(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
