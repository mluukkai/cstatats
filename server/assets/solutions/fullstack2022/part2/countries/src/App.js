import axios from 'axios'
import { useState, useEffect } from 'react'

const Weather = ({ weather, city }) => {
  if ( weather === null ) return null

  const icon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return <div>
    <h3>Weather in {city}</h3>

    <div>
      temperature {weather.main.temp} Celcius
    </div>

    <div>
      <img src={icon} alt={`icon for ${weather.weather[0].description}`} />
    </div>
    
    <div>
      wind {weather.wind.speed} m/s
    </div>

  </div>

}

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const languages = Object.values(country.languages)
  const capital = country.capital[0]

  useEffect(() => {
    const key = process.env.REACT_APP_API_KEY
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${key}&units=metric`
    axios.get(url).then(({data}) => {
      setWeather(data)
    })
  }, [])

  return <div>
    <h2>{country.name.common}</h2>
    <div>capital {capital} </div>
    <div>area {country.area} </div>

    <h4>languages:</h4>
    <ul>
      {languages.map(language => 
        <li key={language}>
          {language}
        </li>
      )}
    </ul>

    <img
      src={country.flags.png}
      alt={`Flag of ${country.name.common}`}
      width={150}
    />

    <Weather weather={weather} city={capital} />
  </div>
}

const Contrylist = ({ countries, setFilter }) => {
  if (countries.length>10) {
    return <div>Too many countries, specify some other fliter</div>
  }

  if (countries.length===0) {
    return <div>No matches, specify some other fliter</div>
  }

  if (countries.length>1) {
    return (
      <div>
        {countries.map(({name}) =>
          <div key={name.common}>
            {name.common}
            <button onClick={() => setFilter(name.common)}>show</button>
          </div>
        )}
      </div>
    )
  }

  return <Country country={countries[0]} />
}

const App = () => {
  const [countries, setCountries ] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(({ data }) => {
      setCountries(data)
    })
  }, [])

  const filtered = countries.filter(c => c.name.common.toLowerCase().includes(filter.toLowerCase()))

  return <>
    <div>
      find countries
      <input
        value={filter}
        onChange={({ target }) => setFilter(target.value)}
      />
    </div>
    <Contrylist
      countries={filtered}
      setFilter={setFilter}
    />
  </>
}

export default App