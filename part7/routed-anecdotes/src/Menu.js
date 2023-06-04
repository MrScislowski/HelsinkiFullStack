import {
    BrowserRouter as Router, Route, Routes, Link
} from 'react-router-dom'
import { AnecdoteList, About, CreateNew, Anecdote } from './App'

const Menu = props => {
    const { anecdotes, addNew } = props
  
    const padding = {
      paddingRight: 5
    }
  
    return (
      <Router>
        <div>
          <Link to='/anecdotes' style={padding}>anecdotes</Link>
          <Link to='/create' style={padding}>create new</Link>
          <Link to='/about' style={padding}>about</Link>
        </div>
  
        <Routes>
          <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path='/anecdotes' element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path='/about' element={<About />} />
          <Route path='/create' element={<CreateNew addNew={addNew} />} />
          <Route path='/anecdotes/:id' element={<Anecdote anecdotes={anecdotes} />} />
        </Routes>
      </Router>
    )
  }

  export default Menu