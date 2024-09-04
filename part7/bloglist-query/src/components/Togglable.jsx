import { forwardRef, useState, useImperativeHandle } from "react";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div className="m-4 max-w-fit rounded-lg border-2 border-violet-400 p-4">
      {visible && props.children}
      <button
        className={`${visible ? "text-yellow-300 hover:text-yellow-200" : "text-green-500 hover:text-green-200"}`}
        onClick={toggleVisibility}
      >
        {visible ? "cancel" : props.buttonLabel}{" "}
      </button>
    </div>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;
