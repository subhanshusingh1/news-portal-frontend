import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Fetch specific event by ID
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id) => {
    const response = await axios.get(`http://localhost:8000/api/v1/content/events/${id}`);
    return response.data;
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    event: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default eventsSlice.reducer;
