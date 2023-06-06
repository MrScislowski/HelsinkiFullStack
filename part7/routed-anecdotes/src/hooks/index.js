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

export const useField = (name, type) => {
    const [value, setValue] = useState()

    const onChange = (e) => {
        setValue(e.target.value)
    }

    const reset = () => {
        setValue(blankFieldValue(type))
    }

    return {
        type, name, value, onChange, reset
    }
}