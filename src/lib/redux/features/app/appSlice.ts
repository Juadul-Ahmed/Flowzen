import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  status: "idle" | "loading" | "success" | "error";
}

const initialState: AppState = {
  status: "idle",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<AppState["status"]>) => {
      state.status = action.payload;
    },

    resetStatus: (state) => {
      state.status = "idle";
    },
  },
});

export const { setStatus, resetStatus } = appSlice.actions;

export default appSlice.reducer;