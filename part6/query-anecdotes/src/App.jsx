import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { showNotification, hideNotification, useNotificationDispatch } from './NotificationContext'
import axios from 'axios'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const voteMutation = useMutation({
    mutationFn: anecdote => {
      return axios.patch(`http://localhost:3001/anecdotes/${anecdote.id}`, { ...anecdote, votes: anecdote.votes + 1}).then(res => res.data)
    },
    onSuccess: updatedAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'],
        anecdotes.map(a => a.id !== updatedAnecdote.id ? a : updatedAnecdote)
      )
      notificationDispatch(showNotification(`voted for anecdote ${updatedAnecdote.content}`))
      setTimeout(() => notificationDispatch(hideNotification()), 3000)
    }
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote)
  }

  const query = useQuery({
    queryKey: ['anecdotes'],
    queryFn: () => axios.get('http://localhost:3001/anecdotes').then(res => res.data),
    retry: false
  })

  if (query.isLoading) {
    return <div>loading ...</div>
  }

  if (query.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = query.data

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
