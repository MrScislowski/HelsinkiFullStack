import Togglable from './Togglable'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { blogDispatches } from '../reducers/blogReducer';
import { displayActions } from '../reducers/displayReducer';

const useField = (name) => {
  const [fieldValue, setFieldValue] = useState('');

  return {
    name,
    type: 'text',
    value: fieldValue,
    placeholder: name,
    onChange: ({target}) => setFieldValue(target.value)
  }
}

const AddBlogForm = (props) => {
  const dispatch = useDispatch()

  const formElements = [
    useField('title'),
    useField('author'),
    useField('url')
  ]

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    const blogFormContents = formElements.reduce((acc, curField) => {
      acc[curField.name] = curField.value;
      return acc;
    }, {});
    const blogObject = {
        ...blogFormContents,
        likes: 0,
    }
    dispatch(blogDispatches.addBlog(blogObject))
    formElements.forEach(el => el.onChange({target: {value: ''}}));
  }

  const visibility = useSelector(state => state.display)


  return (
    <>
      <Togglable visibility={visibility.newBlogForm} buttonLabel='add new blog' dispatch={dispatch} action={() => displayActions.toggleNewBlogForm}>
        <h2>create new</h2>
        <form onSubmit={handleCreateNewBlog}>
          {formElements.map(el => <div key={el.name}>{el.name}: <input {...el} /></div>)}
          <button className='add-blog-form-button' type="submit">create</button>
        </form>
      </Togglable>
    </>
  )
}

export default AddBlogForm