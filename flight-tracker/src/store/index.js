import { configureStore } from '@reduxjs/toolkit';
import flightsReducer from './flightsSlice';

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
  },
});