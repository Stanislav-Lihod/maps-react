import { useCities } from '../contexts/CitiesProvider'
import CountryItem from './CountryItem'
import styles from './CountryList.module.css'
import Message from './Message'
import Spinner from './Spinner'

export default function CountryList() {
  const {cities, isLoading} = useCities()
  
  if (isLoading) return <Spinner/>

  if (!cities.length) return <Message message={'Add your first city by click a city on the map'}/>
  const countries = [];
  const seen = new Set();

  cities.forEach(city => {
    if (!seen.has(city.country)) {
      seen.add(city.country);
      countries.push({ country: city.country, emoji: city.emoji });
    }
  });

  return (
    <ul className={styles.countryList}>
      {countries.map(country => <CountryItem country={country} key={country.country}/>)}
    </ul>
  )
}
