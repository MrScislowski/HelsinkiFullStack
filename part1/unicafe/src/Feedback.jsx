const Button = (props) => {
  const { name, setter } = props;

  return <button onClick={() => setter((n) => n + 1)}>{name}</button>;
};

const Feedback = (props) => {
  const { setGood, setNeutral, setBad } = props;

  // read about this approach (passing function to state setter) here:
  // https://react.dev/learn/queueing-a-series-of-state-updates

  // I'm excited about it because I had to pass half the props, it separates the concerns of access and mutation,  and this seems related to reducers which I didn't understand all that well first go around
  return (
    <>
      <h2>Give feedback</h2>
      <Button name="good" setter={setGood} />
      <Button name="neutral" setter={setNeutral} />
      <Button name="bad" setter={setBad} />
    </>
  );
};

export default Feedback;
