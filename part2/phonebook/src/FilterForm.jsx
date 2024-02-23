const FilterForm = (props) => {
  const { searchTerm, setSearchTerm } = props;

  return (
    <p>
      filter shown with{" "}
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </p>
  );
};

export default FilterForm;
