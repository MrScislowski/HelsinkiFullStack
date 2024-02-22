const Feedback = (props) => {
  const { setGood, setNeutral, setBad } = props;

  // read about this approach (passing function to state setter) here:
  // https://react.dev/learn/queueing-a-series-of-state-updates

  // I'm excited about it because I had to pass half the props, it separates the concerns of access and mutation,  and this seems related to reducers which I didn't understand all that well first go around
  return (
    <>
      <h2>Give feedback</h2>
      <button onClick={() => setGood((n) => n + 1)}>good</button>
      <button onClick={() => setNeutral((n) => n + 1)}>neutral</button>
      <button onClick={() => setBad((n) => n + 1)}>bad</button>
    </>
  );
};

export default Feedback;
