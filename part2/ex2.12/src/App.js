import { useState, useEffect } from 'react'
import axios from 'axios'


const CountryInput = ({countrySearchKey, setCountrySearchKey}) => {
  return (
    <p>
      find countries 
      <input value={countrySearchKey}
        onChange={(e) => setCountrySearchKey(e.target.value)}/>
    </p>
  )
}

const DisplayCountrySearchInfo = ({countries, setCountrySearchKey}) => {
  if (countries.length >= 10) {
    return "Too many matches, specify another filter"
  }
  else if (countries.length === 1) {
    return <DisplayCountryStats country={countries[0]} />
  } else {
    return <DisplayAbbreviatedResults countries={countries} setCountrySearchKey={setCountrySearchKey}/>
  }
}
  
const DisplayAbbreviatedResults = ({countries, setCountrySearchKey}) => {
  return (
    <>
    {countries.map(c => <CountrySelectionRow key={c.ccn3} 
      country={c} 
      setCountrySearchKey={setCountrySearchKey} />)}
    </>
  )
}

const CountrySelectionRow = ({country, setCountrySearchKey}) => {
  return (
    <p>
      {country.name.common} <CountrySelectButton country={country} setCountrySearchKey={setCountrySearchKey} />
    </p>
  )
}

const CountrySelectButton = ({country, setCountrySearchKey}) => {
  return (
  <>
  <button onClick={() => setCountrySearchKey(country.name.common) }>
    show
  </button>
  </>
  )
}

const DisplayCountryStats = ({country}) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <h3>languages: </h3>
      <ul>
      {Object.keys(country.languages).map((k, i) => {
        return <li key={i}>{country.languages[k]}</li>
      })}
      </ul>
      <img src={country.flags.png} alt="country flag"/>
      <h3>Weather in {country.capital}</h3>
      {/* Todo: https://fullstackopen.com/en/part2/getting_data_from_server
      (make sure to do the right thing when it comes to API keys etc)
       */}
      <DisplayWeather country={country}/>
    </div>
  )
}

const DisplayWeather = ({country}) => {
  const [weatherInfo, setWeatherInfo] = useState({})

  const [lat, lng] = country.capitalInfo.latlng
  const apiKey = process.env.REACT_APP_API_KEY

  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}`
  
  useEffect(() => {
    axios
      .get(weatherUrl)
      .then(response => 
        setWeatherInfo(response.data))
    
    // https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook
    // eslint-disable-next-line 
  }, [])
  
  if (Object.keys(weatherInfo).length === 0) {
    return 
  } else {
    return (
      <>
      <p>temperature {weatherInfo.list[0].main.temp - 273} Celsius </p>
      <img src={`http://openweathermap.org/img/wn/${weatherInfo.list[0].weather[0].icon}@2x.png`}
        alt={weatherInfo.list[0].weather[0].description}/>
      <p>wind {weatherInfo.list[0].wind.speed} m/s</p>
      </>
    )
  }

}


const App = () => {

  const [countrySearchKey, setCountrySearchKey] = useState('')
  const [countries, setCountries] = useState([])


  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToDisplay = countries.filter(country => {
    return country.name.common.toLowerCase().includes(countrySearchKey.toLowerCase())
  })


  return (
    <div>
    <CountryInput countrySearchKey={countrySearchKey} setCountrySearchKey={setCountrySearchKey} />
    <DisplayCountrySearchInfo countries={countriesToDisplay} setCountrySearchKey={setCountrySearchKey} />
    </div>
  );
}

export default App;
