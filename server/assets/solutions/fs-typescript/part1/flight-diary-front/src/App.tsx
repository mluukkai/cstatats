import { useState, useEffect } from 'react';
import { getDiaries, createDiary } from './diaryService';

import { NonSensitiveDiaryEntry, NewDiaryEntry, Weather, Visibility } from './types';

import { isAxiosError } from 'axios';
 
const Diary = ({ entry }: { entry: NonSensitiveDiaryEntry }) => {
  return (
    <div>
      <h4>{entry.date}</h4>
      <div>
        <div>visibility: {entry.visibility}</div>
        <div>weather: {entry.weather}</div>
      </div>
    </div>
  )
}

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('2023-01-01')
  const [visibility, setVisibility] = useState<Visibility|null>(null)
  const [weather, setWeather] = useState<Weather|null>(null)
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const notifyWith = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000) 
  }

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault()
    if ( !visibility || !weather) {
      notifyWith('visibility and weather must be set');
      return 
    }

    const object: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment
    }

    createDiary(object)
      .then(data => {
        setDiaries(diaries.concat(data))
        setComment('')
        setDate('')
        setWeather(null)
        setVisibility(null)
      })
      .catch(error => {
        console.log('aa')
        if (isAxiosError(error)) {
          const message = error.response && error.response.data
            ? error.response.data.replace('Something went wrong. ','') 
            : 'Addition failed, reason unknown...'
          notifyWith(message);
        } 
      })
  }

  useEffect(() => {
    getDiaries().then(data => {
      setDiaries(data)
    })
  }, [])

  const weathers = Object.values(Weather);
  const visibilities = Object.values(Visibility);

  return (
    <div>
      <h3>Add new entry</h3>
      {error && <div style={{ color: 'red', marginBottom: 10} }>{error}</div>}
      <form onSubmit={addDiary}>
        <div>
          date 
        <input
          type="date"
          value={date}
          onChange={({target}) => setDate(target.value)}
        />
        </div>

        <div>
          <span style={{ marginRight: 15 }}>visibility</span>
          {visibilities.map(v => 
            <span key={v}>
              {v} <input checked={v===visibility} type="radio" name="visibility" onChange={() => setVisibility(v)} />
            </span>
          )}
        </div>
        <div>
          <span style={{ marginRight: 15 }}>weather</span>
          {weathers.map(w => 
            <span key={w}>
              {w} <input checked={w===weather} type="radio" name="weather" onChange={() => setWeather(w)} />
            </span>
          )}
        </div>
        <div>
          comment 
          <input value={comment} onChange={({target}) => setComment(target.value)}/>
        </div>
        
        <button type="submit">add</button>
      </form>

      <h3>Diary entries</h3>
      {diaries.map(d => 
        <Diary key={d.id} entry={d}/>
      )}
    </div>
  )
}

export default App;