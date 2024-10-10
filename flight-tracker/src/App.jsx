import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MapView from './components/MapView';
import FlightTable from './components/FlightTable';
import Chat from './components/Chat';
import { WebSocketProvider } from './contexts/WebSocketContext';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <WebSocketProvider>
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col md={8} className="h-100 d-flex flex-column">
            <h2>Mapa de Vuelos</h2>
            <div className="map-container">
              <MapView />
            </div>
            <h2>Vuelos Activos</h2>
            <div className="table-container flex-grow-1 overflow-auto">
              <FlightTable />
            </div>
          </Col>
          <Col md={4} className="h-100 d-flex flex-column">
            <h2>Chat</h2>
            <div className="chat-container flex-grow-1 overflow-auto">
              <Chat />
            </div>
          </Col>
        </Row>
      </Container>
    </WebSocketProvider>
  );
}

export default App;
