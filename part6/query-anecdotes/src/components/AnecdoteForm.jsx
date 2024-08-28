import { useQueryClient, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { hideNotification, showNotification, useNotificationDispatch } from '../NotificationContext'


const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: (content) => {
      return axios.post('http://localhost:3001/anecdotes', { content, votes: 0 }).then(res => res.data)
    },
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      notificationDispatch(showNotification(`Posted new anecdote: ${newAnecdote.content}`))
      setTimeout(() => notificationDispatch(hideNotification()), 3000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    newAnecdoteMutation.mutate(content)
    event.target.anecdote.value = ''

}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
