import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../store/flightsSlice';
import { useWebSocket } from '../contexts/WebSocketContext';

function Chat() {
  const [content, setContent] = useState('');
  const messages = useSelector(state => state.flights.messages);
  const dispatch = useDispatch();
  const { sendMessage } = useWebSocket();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      sendMessage(JSON.stringify({ type: 'chat', content }));
      setContent('');
    }
  };

  return (
    <div>
      <ListGroup className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <ListGroup.Item
            key={index}
            variant={message.level === 'warn' ? 'danger' : 'light'}
          >
            <strong>{message.name}</strong> [{new Date(message.date).toLocaleString()}]: {message.content}
          </ListGroup.Item>
        ))}
        <div ref={chatEndRef} />
      </ListGroup>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </div>
  );
}

export default Chat;