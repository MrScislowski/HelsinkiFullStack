import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { initializeAnecdotesFromDb } from './reducers/anecdoteReducer'


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotesFromDb())
  }, [dispatch])

  const anecdotes = useSelector(({anecdotes, filter}) => {
    if ( filter === '' ) {
      return anecdotes
    }

    return anecdotes.filter(an => an.content.indexOf(filter) !== -1)
  })
  
  const filter = useSelector(state => state.filter)

  return (
    <div>
      <Notification />

      <Filter filter={filter} />

      <AnecdoteList anecdotes={anecdotes} />
      
      <AnecdoteForm />
      
    </div>
  )
}

export default App