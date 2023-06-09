import { useContext } from "react"
import NotificationContext from "./NotificationContext"
import { useNavigate } from "react-router-dom"
import { useField, resetField } from "./hooks"


const CreateNew = (props) => {
  const contentField = useField('content', 'text')
  const authorField = useField('author', 'text')
  const infoField = useField('info', 'text')

  const formFields = [contentField, authorField, infoField]
  const resetAllFields = () => formFields.forEach(ff => resetField(ff))

  const [notification, setNotification] = useContext(NotificationContext)

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: contentField.value,
      author: authorField.value,
      info: infoField.value,
      votes: 0
    })
    setNotification(`New anecdote '${contentField.value}' created!`)
    navigate('/anecdotes')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentField} />
        </div>
        <div>
          author
          <input {...authorField} />
        </div>
        <div>
          url for more info
          <input {...infoField} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={resetAllFields}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew