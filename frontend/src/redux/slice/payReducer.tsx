import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface passionState {
  passion_number: number;
}

const initialState: passionState = {
  passion_number: 0
};

export const payReducer = createSlice({
  name: "city-park",
  initialState,
  reducers: {
    
    passion_number: (state, action: PayloadAction<number>) => {
      state.passion_number = action.payload;
    },
  },
});

export const { passion_number } = payReducer.actions;

export default payReducer.reducer;
