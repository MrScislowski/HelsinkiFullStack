import { useState } from "react";

export const useField = (name, type) => {
    const [value, setValue] = useState()

    const onChange = (e) => {
        setValue(e.target.value)
    }

    return {
        type, name, value, onChange
    }
}