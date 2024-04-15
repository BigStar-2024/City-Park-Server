import { configureStore } from '@reduxjs/toolkit';
import payReducer from '../redux/slice/payReducer';

export const store = configureStore({
  reducer: {
    pay: payReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch