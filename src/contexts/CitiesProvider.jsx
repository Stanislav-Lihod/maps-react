import { createContext, useCallback, useContext, useEffect, useReducer } from "react"

const BASE_URL = 'http://localhost:7890'

const CitiesContext = createContext()

const initialState ={
  cities: [],
  isLoading: false,
  currentCity: {},
  error: ''
}

const reducer = function (state, action){
  switch (action.type) {
    case 'setLoading':
      return {...state, isLoading: true}
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload
      }
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload
      }
    case 'cities/added':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload
      }
    case 'cities/removed':
      return{
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload),
        currentCity: {}
      }
    case 'rejected':
      return{
        ...state,
        isLoading: false,
        error: action.payload
      }
    default:
      return state;
  }

}

function CitiesProvider({children}) {
  const [{cities, isLoading, currentCity, error}, dispatch] = useReducer(reducer, initialState)

  useEffect(()=>{
    async function fetchCities(){
      try {
        dispatch({type: 'setLoading'})
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({type: 'cities/loaded', payload: data})
      } catch {
        dispatch({type: 'rejected', payload: 'Something went wrong!'})
      }
    }

    fetchCities()
  }, [])

  const getCity = useCallback(async function getCity(id){
    if (Number(id) === currentCity.id) return

    try {
      dispatch({type: 'setLoading'})
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({type: 'city/loaded', payload: data})
    } catch {
      dispatch({type: 'rejected', payload: 'Something went wrong!'})
    }
  }, [currentCity.id])

  async function addCity(city){
    try {
      dispatch({type: 'setLoading'})
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(city),
        headers:{
          "Content-Type": "application/json",
        }
      });
      const data = await res.json()
      dispatch({type: 'cities/added', payload: data})
    } catch {
      dispatch({type: 'rejected', payload: 'Something went wrong!'})
    }
  }

  async function removeCity(id){
    try {
      dispatch({type: 'setLoading'})
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({type: 'cities/removed', payload: id})
    } catch {
      dispatch({type: 'rejected', payload: 'Something went wrong!'})
    } 
  }

  return (
    <CitiesContext.Provider value={{
      cities, isLoading, currentCity, error, getCity, addCity, removeCity
    }}>
      {children}
    </CitiesContext.Provider>
  )
}

function useCities(){
  return useContext(CitiesContext)
}

export {CitiesProvider, useCities}
