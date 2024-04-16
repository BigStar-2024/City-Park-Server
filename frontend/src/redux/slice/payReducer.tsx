import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface passionState {
  passion_number: Array<Number>;
}

const initialState: passionState = {
  passion_number: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

export const payReducer = createSlice({
  name: "passion_number",
  initialState,
  reducers: {
    passion_number: (state, action: PayloadAction<number>) => {
      state.passion_number = [action.payload]; // Wrap action.payload in an array
    },
  },
});

export const { passion_number } = payReducer.actions;

export default payReducer.reducer;
