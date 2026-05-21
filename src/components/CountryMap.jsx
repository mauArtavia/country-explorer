import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

// Fix del icono default de Leaflet que se rompe con Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export function CountryMap({ lat, lng, name }) {
  if (lat == null || lng == null) return null

  return (
    <div style={{
      borderRadius: '6px',
      overflow: 'hidden',
      border: '0.5px solid var(--border)',
      height: '220px',
    }}>
      <MapContainer
        center={[lat, lng]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <span style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '12px',
            }}>
              {name}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}