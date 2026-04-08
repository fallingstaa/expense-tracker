import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase();
  },
});

export default authSlice.reducer;
