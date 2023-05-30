
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const url = `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${city}`
    axios.get(url).then(respone => {
      console.log(respone.data.current)
      setWeather(respone.data.current)
    })
  },[city])

  if (!weather) {
    return null
  }

  return(
    <div>
      <h3>Weather in {city}</h3>
      <div>
        <div>
          temperature {weather.temperature} Celcius
        </div>
        <img src={weather.weather_icons[0]} alt={weather.weather_descriptions[0]} width='100'/>
        <div>
          wind {weather.wind_speed} mph, direction {weather.wind_dir}
        </div>
      </div>
    </div>
  )
} 

const Country = ({country}) => {
  return <div>
    <h2>{country.name}</h2>

    <div>
        capital {country.capital}
    </div>
    <div>
      population {country.population}
    </div>
    
    <h3>languages</h3>
  
    <ul>
    {country.languages.map(lang =>
      <li key={lang.iso639_1}>{lang.name}</li>
    )} 
    </ul>
   
    <img src={country.flag} alt={`flag of ${country.name}`} width='150'/>

    <Weather city={country.capital} />
  </div>
}

const Countries = ({ countries, setFilter }) => {
  if (countries.length === 0) {
    return <p>No matches :(</p>
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return  <Country country={countries[0]}/> 
  }

  return <div>
    {countries.map(c => 
      <div key={c.alpha2Code}>
        {c.name} 
        <button onClick={() => setFilter(c.name)}>
          show
        </button>
      </div>
    )}
  </div>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
      setCountries(response.data)
    })
  }, [])

  const matchingCountries = countries.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()) )

  return (
    <div>
      find countries
      <input
        value={filter}
        onChange={({ target }) => setFilter(target.value)}
      />
      <Countries countries={matchingCountries} setFilter={setFilter} />
    </div>
  )
}

export default App
