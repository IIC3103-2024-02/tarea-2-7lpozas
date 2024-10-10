import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { removeOldEvents } from '../store/flightsSlice';
import 'leaflet/dist/leaflet.css';

function MapView() {
  const dispatch = useDispatch();
  const flights = useSelector(state => state.flights.flights);
  const planes = useSelector(state => state.flights.planes);
  const takeoffs = useSelector(state => state.flights.takeoffs);
  const landings = useSelector(state => state.flights.landings);
  const crashes = useSelector(state => state.flights.crashes);

  const [mapCenter, setMapCenter] = useState([0, 0]);

  useEffect(() => {
    if (Object.keys(flights).length > 0) {
      const firstFlight = Object.values(flights)[0];
      if (firstFlight?.departure?.location?.lat && firstFlight?.departure?.location?.long) {
        setMapCenter([firstFlight.departure.location.lat, firstFlight.departure.location.long]);
      }
    }
  }, [flights]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(removeOldEvents());
    }, 10000); 

    return () => clearInterval(interval);
  }, [dispatch]);

  const planeIcon = useMemo(() => L.icon({
    iconUrl: '/plane-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }), []);

  const departureIcon = useMemo(() => L.icon({
    iconUrl: '/departure-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }), []);

  const destinationIcon = useMemo(() => L.icon({
    iconUrl: '/destination-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }), []);

  const flightMarkers = useMemo(() => Object.values(flights).map((flight) => (
    flight?.departure?.location?.lat && flight?.departure?.location?.long &&
    flight?.destination?.location?.lat && flight?.destination?.location?.long ? (
      <React.Fragment key={flight.id}>
        <Marker position={[flight.departure.location.lat, flight.departure.location.long]} icon={departureIcon}>
          <Popup>
            <strong>{flight.departure.name}</strong><br />
            ID: {flight.departure.id}<br />
            Ciudad: {flight.departure.city.name}<br />
            País: {flight.departure.city.country.name}
          </Popup>
        </Marker>
        <Marker position={[flight.destination.location.lat, flight.destination.location.long]} icon={destinationIcon}>
          <Popup>
            <strong>{flight.destination.name}</strong><br />
            ID: {flight.destination.id}<br />
            Ciudad: {flight.destination.city.name}<br />
            País: {flight.destination.city.country.name}
          </Popup>
        </Marker>
        <Polyline
          positions={[
            [flight.departure.location.lat, flight.departure.location.long],
            [flight.destination.location.lat, flight.destination.location.long]
          ]}
          color="blue"
        />
      </React.Fragment>
    ) : null
  )), [flights, departureIcon, destinationIcon]);

  const planeMarkers = useMemo(() => Object.values(planes).map((plane) => (
    plane?.position?.lat && plane?.position?.long ? (
      <Marker key={plane.flight_id} position={[plane.position.lat, plane.position.long]} icon={planeIcon}>
        <Popup>
          <strong>Vuelo: {plane.flight_id}</strong><br />
          Aerolínea: {plane.airline.name}<br />
          Capitán: {plane.captain}<br />
          ETA: {plane.ETA.toFixed(2)} horas<br />
          Estado: {plane.status}
        </Popup>
      </Marker>
    ) : null
  )), [planes, planeIcon]);

  const createCircles = useCallback((events, color) => {
    return events.map((event) => {
      const flight = flights[event.id];
      const plane = planes[event.id];
      let position;

      if (color === 'green' && flight?.departure?.location) {
        position = [flight.departure.location.lat, flight.departure.location.long];
      } else if (color === 'blue' && flight?.destination?.location) {
        position = [flight.destination.location.lat, flight.destination.location.long];
      } else if (color === 'red' && plane?.position) {
        position = [plane.position.lat, plane.position.long];
      }

      return position ? (
        <Circle
          key={`${color}-${event.id}-${event.timestamp}`}
          center={position}
          radius={100000}
          color={color}
        />
      ) : null;
    });
  }, [flights, planes]);

  const takeoffCircles = useMemo(() => createCircles(takeoffs, 'green'), [takeoffs, createCircles]);
  const landingCircles = useMemo(() => createCircles(landings, 'blue'), [landings, createCircles]);
  const crashCircles = useMemo(() => createCircles(crashes, 'red'), [crashes, createCircles]);

  return (
    <MapContainer center={mapCenter} zoom={3} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {flightMarkers}
      {planeMarkers}
      {takeoffCircles}
      {landingCircles}
      {crashCircles}
    </MapContainer>
  );
}

export default MapView;