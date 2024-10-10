import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function FlightTable() {
  const flights = useSelector(state => state.flights.flights);
  const planes = useSelector(state => state.flights.planes);

  const sortedFlights = Object.values(flights).sort((a, b) => {
    if (a.departure.name < b.departure.name) return -1;
    if (a.departure.name > b.departure.name) return 1;
    if (a.destination.name < b.destination.name) return -1;
    if (a.destination.name > b.destination.name) return 1;
    return 0;
  });

  const getPlaneInfo = (flightId) => {
    return planes[flightId] || {};
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Flight</th>
          <th>Origin</th>
          <th>Destination</th>
          <th>ETA</th>
          <th>Captain</th>
        </tr>
      </thead>
      <tbody>
        {sortedFlights.map((flight) => {
          const planeInfo = getPlaneInfo(flight.id);
          return (
            <tr key={flight.id}>
              <td>{flight.id}</td>
              <td>{flight.departure.name}</td>
              <td>{flight.destination.name}</td>
              <td>{planeInfo.ETA ? `${planeInfo.ETA.toFixed(2)} hours` : 'N/A'}</td>
              <td>{planeInfo.captain || 'N/A'}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default FlightTable;