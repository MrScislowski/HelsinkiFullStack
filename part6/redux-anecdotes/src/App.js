import { useSelector } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  const anecdotes = useSelector(state => state)

  return (
    <div>
      <AnecdoteList anecdotes={anecdotes} />
      
      <AnecdoteForm />
      
    </div>
  )
}

export default App