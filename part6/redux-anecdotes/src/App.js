import { useSelector } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import FilterTextInput from './components/FilterTextInput'

const App = () => {
  const anecdotes = useSelector(state => state)

  return (
    <div>
      <FilterTextInput />

      <AnecdoteList anecdotes={anecdotes} />
      
      <AnecdoteForm />
      
    </div>
  )
}

export default App