import { useSelector } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'

const App = () => {
  const anecdotes = useSelector(({anecdotes, filter}) => {
    if ( filter === '' ) {
      return anecdotes
    }

    return anecdotes.filter(an => an.content.indexOf(filter) !== -1)
  })
  const filter = useSelector(state => state.filter)

  return (
    <div>
      <Filter filter={filter} />

      <AnecdoteList anecdotes={anecdotes} />
      
      <AnecdoteForm />
      
    </div>
  )
}

export default App