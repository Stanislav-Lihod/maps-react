import { useEffect, useReducer } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesProvider";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const initialState = {
  cityName: '',
  country: '',
  isLoading: false,
  error: '',
  emoji: '',
  date: new Date(),
  notes: ''
}

function reducer(state, action){
  switch (action.type) {
    case 'setIsLoading': 
      return {...state, isLoading: true, error: ''}
    case 'setLocation':
      return {
        ...state,
        cityName: action.payload.city,
        country: action.payload.country,
        emoji: action.payload.emoji,
        isLoading: false
      };
    case 'setCity':
      return {...state, cityName: action.payload }
    case 'setDate':
      return {...state, date: action.payload }
    case 'setNotes':
      return {...state, notes: action.payload }
    case 'setError':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

function Form() {
  const [{cityName, country, emoji, isLoading, error, date, notes}, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()
  const [searchParam] = useSearchParams()
  const lat = searchParam.get('lat')
  const lng = searchParam.get('lng')

  const {addCity, isLoading: isContextLoading} = useCities()

  useEffect(()=>{
    if (!lat || !lng) return

    async function fetchCity() {
      try {
        dispatch({type: 'setIsLoading'})
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await res.json()

        if (!data.city) throw new Error('Please choose another place')

        dispatch({type: 'setLocation', payload:{
          city: data.city,
          country: data.countryName,
          emoji: convertToEmoji(data.countryCode)
        }})      
      } catch (err) {
        dispatch({type: 'setError', payload: err.message})
      } 

    }
    fetchCity()
  }, [lat,lng])

  async function handleSubmit(e){
    e.preventDefault()

    if (!cityName || !country) return

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position:{
        lat,
        lng
      }
    }

    await addCity(newCity)
    navigate('/app/cities')
  }

  if (isLoading) return <Spinner/>

  if (error) return <Message message={error}/>

  return (
    <form className={`${styles.form} ${isContextLoading ? styles.loading: ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => dispatch({type: 'setCity', payload:e.target.value})}
          value={cityName} 
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => dispatch({type: 'setDate', payload:e.target.value})}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => dispatch({type: 'setNotes', payload:e.target.value})}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>App</Button>
        <Button type='back' onClick={(e)=>{
          e.preventDefault()
          navigate('/app/cities')
        }}>&larr; Back</Button>
      </div>
    </form>
  );
}

export default Form;
