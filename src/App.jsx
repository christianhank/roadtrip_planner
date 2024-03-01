/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl';
import { v4 as uuidv4 } from 'uuid';
import './App.css'
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { createCustomMarker, fetchAllCoordinates, fetchCoordinates, mittelpunktKoordinaten } from './utils';
import LocationList from './components/LocationList';
import Details from './components/Details';

/* TO DO: 

- Marker mit Start/ende versehen
- Marker mit Stationen Nummer versehen
- Distanz
- Länge Zeit
- wenn nur einer oder kein punkt da ist dann sollen die linien und marker verschwinden



*/
function App() {

  let accessToken = 'pk.eyJ1IjoiczBwaHQiLCJhIjoiY2xzbWllbmF4MHBmZTJqcGU4MHV0bjlzNyJ9.YARiQXCwataD0dgkZQ7Qww'
  mapboxgl.accessToken = accessToken;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(7);
  const [coordinates, setCoordinates] = useState([{ "lat": 50.35, "lng": 8.9 }]);
  const [details, setDetails] = useState([]);

  const [points, setPoints] = useState([
    { id: uuidv4(), name: 'Trier' },
    { id: uuidv4(), name: 'Berlin' },

  ]);


  async function fetchRoute(coordinates, accessToken) {
    const coords = coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&steps=true&access_token=${accessToken}&overview=full`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const route = data.routes[0].geometry;

      const formattedLocations = data.waypoints.map(item => ({

        lng: item.location[0],
        lat: item.location[1],
      }));

      setCoordinates(formattedLocations)
      setDetails(data.routes)

      return route;
    } catch (error) {
      console.error('Error fetching route:', error);
      return null;
    }
  }


  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: mittelpunktKoordinaten(coordinates),
      zoom: zoom
    });

    const language = new MapboxLanguage();
    map.current.addControl(language);
  }, [points])

  useEffect(() => {


    const updateRoute = () => {
      // Koordinaten der Punkte abrufen und Route zeichnen
      const cities = points.filter(point => point.name.trim() !== '').map(point => point.name);
      markers.forEach(marker => marker.remove());
      setMarkers([]); // Leeren der Marker-Liste

      fetchAllCoordinates(cities, accessToken)
        .then(coordinates => {

          const newMarkers = coordinates.map((coord, index) => {

            const conditionalMarker = index == 0 || coordinates.length - 1 == index ? {
              color: "green",

              element: createCustomMarker(index, coordinates.length)
            } : {
              color: "green",

            }

            const popup = new mapboxgl.Popup()
              .setHTML(`<h3 className="m-4 p-5">${cities[index]}</h3>`)


            const marker = new mapboxgl.Marker(conditionalMarker)

              .setLngLat(coord)
              .setPopup(popup) // Verknüpfe das Popup mit dem Marker
              .addTo(map.current);
            return marker;
          });
          setMarkers(newMarkers); // Speichere die neuen Marker

          return fetchRoute(coordinates, accessToken)
        })
        .then(route => {
          if (route) {

            // Prüfen, ob die Quelle bereits existiert, wenn ja, aktualisieren, sonst hinzufügen
            if (map.current.getSource('route')) {
              map.current.getSource('route').setData({
                type: 'Feature',
                properties: {},
                geometry: route
              });
            } else {
              map.current.addSource('route', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: route
                }
              });

              map.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': '#282',
                  'line-width': 6
                }
              });
            }
          }
        });
    };

    if (map.current.isStyleLoaded()) {
      updateRoute();
    } else {
      map.current.on('load', updateRoute);
    }

    // Bereinigungsfunktion, um Event-Listener zu entfernen
    return () => {
      map.current.off('load', updateRoute);
    };



  }, [points])





  return (
    <>
      <div className=''>
        <div className='absolute top-20 z-20 '>


          <LocationList points={points} setPoints={setPoints} />


        </div>
        <div className='absolute bottom-10 right-10 z-20 '>



          <Details details={details} />

        </div>

        <div className='bg-gray-800 p-5 mt-20'><h1 className='text-white text-4xl text-center'>Roadtrip Planner</h1></div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </>
  )
}

export default App
