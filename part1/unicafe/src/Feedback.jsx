const Feedback = (props) => {
  return (
    <>
      <h2>Give feedback</h2>
      <button onClick={() => console.log("good clicked")}>good</button>
      <button onClick={() => console.log("neutral clicked")}>neutral</button>
      <button onClick={() => console.log("bad clicked")}>bad</button>
    </>
  );
};
