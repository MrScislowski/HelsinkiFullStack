import {
    Route, Routes, Link, useMatch
} from 'react-router-dom'
import { AnecdoteList, About, CreateNew, Anecdote } from './App'

const Menu = props => {
    const { anecdotes, addNew, notification, setNotification } = props

    const match = useMatch('/anecdotes/:id')
    const selectedAnecdote = match
        ? anecdotes.find(an => an.id === Number(match.params.id))
        : null

    const padding = {
        paddingRight: 5
    }

    return (
        <>
            <div>
                <Link to='/anecdotes' style={padding}>anecdotes</Link>
                <Link to='/create' style={padding}>create new</Link>
                <Link to='/about' style={padding}>about</Link>
            </div>

            <Routes>
                <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
                <Route path='/anecdotes' element={<AnecdoteList anecdotes={anecdotes} />} />
                <Route path='/about' element={<About />} />
                <Route path='/create' element={<CreateNew addNew={addNew} notification={notification} setNotification={setNotification}/>} />
                <Route path='/anecdotes/:id' element={<Anecdote anecdote={selectedAnecdote} />} />
            </Routes>
        </>
    )
}

export default Menu