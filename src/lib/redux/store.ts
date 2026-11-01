
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./features/app/appSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
    },
    devTools: false,
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
