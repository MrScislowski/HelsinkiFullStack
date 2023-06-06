import { useState } from "react";

const blankFieldValue = (type) => {
    switch (type) {
        case 'text':
            return ''

        case 'number': 
            return 0

        default:
            return ''
        
    }
}

export const resetField = ({type, onChange}) => {
    onChange({target: {value: blankFieldValue(type)}})
}

export const useField = (name, type) => {
    const [value, setValue] = useState(blankFieldValue(type))

    const onChange = (e) => {
        setValue(e.target.value)
    }

    return {
        type, name, value, onChange
    }
}