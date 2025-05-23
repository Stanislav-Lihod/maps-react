import styles from "./City.module.css";

import { useNavigate, useParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesProvider";
import Spinner from './Spinner'
import { useEffect } from "react";
import Button from "./Button";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const {id} = useParams()
  const {currentCity, isLoading, getCity} = useCities()

  const navigate = useNavigate()

  useEffect(()=>{
    getCity(id)
  }, [id, getCity])  

  const { cityName, emoji, date, notes } = currentCity;

  if (isLoading) return <Spinner/>

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <Button type='back' onClick={(e)=>{
            e.preventDefault()
            navigate(-1)
          }}>&larr; Back</Button>
      </div>
    </div>
  );
}

export default City;
