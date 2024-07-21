import { createSlice } from "@reduxjs/toolkit";

const userInitialState = {
  data: {},
};
export const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    findAllUserAction: (state) => {
      state.isLoading = true;
      state.error = "";
    },
    findAllUserSuccessAction: (state, { payload: data }) => {
      state.isLoading = false;
      state.data = data;
    },
    findAllUserErrorAction: (state, { payload: error }) => {
      state.isLoading = false;
      state.error = error;
    },
  },
});

const userReducer = userSlice.reducer;
export default userReducer;
// XAC-gkP1-TzS7-7XM72
