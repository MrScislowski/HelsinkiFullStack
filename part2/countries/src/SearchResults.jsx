const SearchResults = (props) => {
  const { filteredCountries, countrySearch } = props;

  if (filteredCountries.length > 10) {
    return <p>too many countries; refine search</p>;
  }

  if (filteredCountries.length == 1) {
    // TODO: CountryDisplay component
    return <h1>{filteredCountries[0].name}</h1>;
  }

  const exactMatch = filteredCountries.find(
    (c) => c.name.toLowerCase() === countrySearch.toLowerCase()
  );

  if (exactMatch) {
    return <h1>{exactMatch.name}</h1>;
  }

  return (
    <ul>
      {filteredCountries.map((cdata) => (
        <li key={cdata.id}>{cdata.name}</li>
      ))}
    </ul>
  );
};

export default SearchResults;
