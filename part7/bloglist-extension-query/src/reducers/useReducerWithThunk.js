import { useReducer } from 'react'

// https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812

export function useReducerWithThunk(reducer, initialState) {
    const [state, dispatch] = useReducer(reducer, initialState);
let customDispatch = (action) => {
        if (typeof action === 'function') {
            action(customDispatch);
        } else {
            dispatch(action); 
       }
    };
return [state, customDispatch];
}
