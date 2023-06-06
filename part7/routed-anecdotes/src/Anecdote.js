const Anecdote = ({ anecdote }) => {
    return (
        <div>
            <blockquote> {anecdote.content} </blockquote>
            <cite> -{anecdote.author} (<a href={anecdote.info}> {anecdote.info} </a>)</cite>
        </div>
    )
}

export default Anecdote