import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  flights: {},
  planes: {},
  messages: [],
  takeoffs: [],
  landings: [],
  crashes: [],
};

export const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setFlights: (state, action) => {
      state.flights = action.payload;
    },
    updatePlane: (state, action) => {
      state.planes[action.payload.flight_id] = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addTakeOff: (state, action) => {
      state.takeoffs.push({ id: action.payload, timestamp: Date.now() });
    },
    addLanding: (state, action) => {
      state.landings.push({ id: action.payload, timestamp: Date.now() });
    },
    addCrash: (state, action) => {
      state.crashes.push({ id: action.payload, timestamp: Date.now() });
    },
    removeOldEvents: (state) => {
      const now = Date.now();
      const oneMinute = 90000; 
      state.takeoffs = state.takeoffs.filter(event => now - event.timestamp < oneMinute);
      state.landings = state.landings.filter(event => now - event.timestamp < oneMinute);
      state.crashes = state.crashes.filter(event => now - event.timestamp < oneMinute);
    },
  },
});

export const { 
  setFlights, 
  updatePlane, 
  addMessage, 
  addTakeOff, 
  addLanding, 
  addCrash,
  removeOldEvents 
} = flightsSlice.actions;

export default flightsSlice.reducer;