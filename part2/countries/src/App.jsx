import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [countrySearch, setCountrySearch] = useState("");
  const [foundCountries, setFoundCountries] = useState("");
  const [countryDataList, setCountryDataList] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountryDataList(
          response.data.map((countryData) => {
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
          })
        );
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
        Country names are:
        <ul>
          {countryDataList.map((cdata) => (
            <li key={cdata.id}>{cdata.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
