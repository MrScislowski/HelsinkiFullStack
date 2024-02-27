import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [countrySearch, setCountrySearch] = useState("");
  const [countryDataList, setCountryDataList] = useState([]);

  const filteredCountries = countryDataList.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const prunedData = response.data.map((countryData) => {
          return {
            name: countryData["name"]["common"],
            id: countryData["cca3"],
            capital: countryData["capital"],
            area: countryData["area"],
            languages: !countryData["languages"]
              ? []
              : Object.keys(countryData["languages"]).map(
                  (key) => countryData["languages"][key]
                ),
            flagUrl: countryData["flags"]["png"],
          };
        });
        setCountryDataList(prunedData);
      });
  }, []);

  return (
    <>
      <p>
        Search for a country:
        <input
          value={countrySearch}
          onChange={(e) => setCountrySearch(e.target.value)}
        />
      </p>

      <div>
        {filteredCountries.length > 10 ? (
          <p>too many countries; refine search</p>
        ) : (
          <ul>
            {filteredCountries.map((cdata) => (
              <li key={cdata.id}>{cdata.name}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
