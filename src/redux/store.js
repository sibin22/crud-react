import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import userReducer from "./user/userSlice";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
