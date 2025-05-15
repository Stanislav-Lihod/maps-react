import { Link } from 'react-router-dom';
import styles from './CityItem.module.css'
import { useCities } from '../contexts/CitiesProvider';

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function CityItem({city}) {
  const {emoji, cityName , date, id, position} = city  
  const {removeCity} = useCities()

  function handleRemove(e){
    e.preventDefault()
    removeCity(id)
  }

  return (
    <li>
      <Link to={`${id}?lat=${position.lat}&lng=${position.lng}`} className={styles.cityItem}>
        <div className={styles.emoji}>{emoji}</div>
        <div className={styles.name}>{cityName}</div>
        <time className={styles.time}>({formatDate(date)})</time>
        <button onClick={handleRemove} className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  )
}
