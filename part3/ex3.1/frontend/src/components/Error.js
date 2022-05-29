const Error = ({message}) => {
    if (message === null) {
        return null
    }

    return (
        <>
        <p className="error">{message}</p>
        </>
    )
}

export default Error