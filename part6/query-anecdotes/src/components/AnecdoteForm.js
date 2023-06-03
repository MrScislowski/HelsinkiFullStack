import { useMutation, useQueryClient } from 'react-query'
import { addAnecdote } from '../requests'
import { displayTimedNotification, useNotificationDispatch } from '../NotificationContext'


const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const createNewAnecdote = content => {
    return {
      id: (100000 * Math.random()).toFixed(0),
      content: content,
      votes: 0
    }
  }

  const addAnecdoteToDb = anecdote => {
    return addAnecdote(anecdote)
  }

  const newAnecdoteMutation = useMutation(addAnecdoteToDb, {
    onSuccess: (newAnecdote) => {
      const priorData = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', [...priorData, newAnecdote])
      displayTimedNotification(notificationDispatch, `created anecdote '${newAnecdote.content}'`, 2)
    },
    onError: (err, variables, onMutateValue) => {
      displayTimedNotification(notificationDispatch, err.response.data.error, 2)
    }
  })


  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = createNewAnecdote(content)
    newAnecdoteMutation.mutate(newAnecdote)
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
