import { useState } from "react"

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const theField = { type, value, onChange }

  Object.defineProperty(theField, 'reset', {
    value: () => setValue(''),
    enumerable: false,
  })

  return theField
}