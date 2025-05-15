import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useCities } from '../contexts/CitiesProvider'
import { useGeolocation } from '../hooks/useGeolocation'
import Button from './Button'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default function Map() {
  const [searchParam] = useSearchParams()
  const {cities} = useCities()

  const [position, setPosition] = useState([40, 0])
  const lat = searchParam.get('lat')
  const lng = searchParam.get('lng')

  const {getPosition, isLoading: isPositionLoading, position: userPosition } = useGeolocation()

  useEffect(()=>{
    if (lat && lng) {      
      setPosition([lat, lng])
    }
  }, [lat, lng])

  useEffect(()=>{
    if (userPosition) setPosition([userPosition.lat, userPosition.lng])
  }, [userPosition])
  
  return (
    <div className={styles.mapContainer}>
      <MapContainer center={position} zoom={6} scrollWheelZoom={true} className={styles.map}>
        {!userPosition && <Button type="position" onClick={getPosition}>{isPositionLoading ? 'Loading...': 'Get your position'}</Button>}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map(city => (
          <Marker key={city.id} position={[city.position.lat, city.position.lng]}>
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}        
        <ChangeCenter position={position}/>
        <DetectClick/>
      </MapContainer>
    </div>
  )
}

function ChangeCenter({position}){
  const map = useMap()
  map.setView(position)
  return null
}

function DetectClick(){
  const navigate = useNavigate()

  useMapEvent({
    click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  })
  return null
}
