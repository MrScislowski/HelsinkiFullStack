import Togglable from './Togglable'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { blogDispatches } from '../reducers/blogReducer';

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

const AddBlogForm = ({ newBlogFormRef }) => {
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

  return (
    <>
      <Togglable startingVisibility={false} buttonLabel='add new blog' ref={newBlogFormRef}>
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