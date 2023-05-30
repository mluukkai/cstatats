import axios from "axios"
import { useState, useEffect } from "react"

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const languages = Object.values(country.languages)
  const flagUrl = country.flags.png
  const capital = country.capital[0]

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_API_KEY
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    axios.get(url).then(({ data }) => {
      setWeather(data)
    })
  }, [])

  if (!weather) {
    return null
  }

  const icon = weather.weather[0].icon
  const weatherIconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>population {country.population}</p>
      <p>capital {capital}</p>

      <h4>languages</h4>

      <ul>
        {languages.map(language => <li key={language}>{language}</li>)}  
      </ul>

      <img src={flagUrl} width='200' />

      <h4>Weather in {capital}</h4>

      <p>temperature {weather.main.temp} Celsius</p>

      <img src={weatherIconUrl} width='80' />

      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryList = ({ countries, showCountry }) => {
  if ( countries.length>10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }

  if ( countries.length===1) {
    return <Country country={countries[0]} />
  }

  return (
    <div>
      {countries.map(c =>
        <p key={c.fifa}>
          {c.name.common}
          <button onClick={() => showCountry(c.name.common)}>
            show
          </button>
        </p>
      )}
    </div>
  )
}
 
const App = () => {
  const [search, setSearch] = useState('fi')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(({ data }) => {
      setCountries(data)
    })
  }, [])

  const matchedContries = countries.filter(c => c.name.common.toLowerCase().includes(search.toLocaleLowerCase()))

  return (
    <div>
      <div>
        find country <input value={search} onChange={({ target }) => setSearch(target.value)} />
      </div>
      <CountryList 
        countries={matchedContries}
        showCountry={setSearch}
      />
    </div>
  )
}

export default App