import { forwardRef, useState, useImperativeHandle } from "react"

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return <div>
    {visible && props.children}
    <button onClick={toggleVisibility}> {visible ? 'cancel' : props.buttonLabel} </button>
  </div>

})

export default Togglable