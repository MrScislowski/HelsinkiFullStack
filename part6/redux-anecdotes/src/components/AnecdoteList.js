import { useDispatch } from "react-redux";
import { castVote } from "../reducers/anecdoteReducer";
import { addNotification, clearNotifications } from "../reducers/notificationReducer";

const AnecdoteList = (props) => {
    const anecdotes = props.anecdotes;
    const dispatch = useDispatch()

    return (
        <>
            <h2>Anecdotes</h2>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => {
                            dispatch(castVote(anecdote.id))
                            dispatch(addNotification(`You voted '${anecdote.content}'`))
                            setTimeout(() => {
                                dispatch(clearNotifications())
                            }, 5000)
                            }}>vote</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList